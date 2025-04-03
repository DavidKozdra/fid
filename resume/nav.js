var supabaseUrl = 'https://aeawxdmvlltkckeoqmfy.supabase.co';
var supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlYXd4ZG12bGx0a2NrZW9xbWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MTcxNDUsImV4cCI6MjA1NzM5MzE0NX0.cKlkkL0TI-8NArepWrHtXMxgU4ytB_bqp8oAyPDGzbE";

var supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Detect if running locally or on GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/fid/resume' : '/resume'; 
const current = window.location.pathname
function renderNav() {
  const nav = document.createElement('nav');
  nav.classList.add('navigation');
  const currentPath = window.location.pathname;
  const BrandLink = document.createElement('a');
  BrandLink.classList.add("brand")
  BrandLink.href = "https://davidkozdra.com";
  BrandLink.textContent = "David Kozdra";
  BrandLink.style.display = "flex";
  BrandLink.style.justifyContent = "center";
  BrandLink.style.alignItems = "center";
  BrandLink.style.width = "50%";
  BrandLink.style.height = "50%";
  BrandLink.style.border = "4px solid #333";
  BrandLink.style.borderRadius = "60%";
  BrandLink.style.textDecoration = "none";
  BrandLink.style.color = "#333";
  BrandLink.style.margin = "auto";

  BrandLink.style.fontSize = "2rem";
  nav.appendChild(BrandLink);
  

  const resumeLink = document.createElement('a');
  resumeLink.href = `${basePath}/index.html`;
  resumeLink.textContent = 'Resume';
  if (currentPath.endsWith('/index.html')) resumeLink.classList.add('current');
  nav.appendChild(resumeLink);

  const uploadLink = document.createElement('a');
  uploadLink.href = `${basePath}/upload/index.html`;
  uploadLink.textContent = 'Upload';
  if (currentPath.endsWith('/upload/index.html')) uploadLink.classList.add('current');

  const galleryLink = document.createElement('a');
  galleryLink.href = `${basePath}/gallery.html`;
  galleryLink.textContent = 'Gallery';
  if (currentPath.endsWith('/gallery.html')) galleryLink.classList.add('current');
  nav.appendChild(galleryLink);

  const authLink = document.createElement('a');
  nav.appendChild(authLink);

  const updateAuthLink = (session) => {
    if (session) {
      nav.appendChild(uploadLink);
      authLink.href = '#';
      authLink.textContent = 'Log Out';
      authLink.onclick = async (e) => {
        e.preventDefault();
        await supabaseClient.auth.signOut();
        window.location.reload();
      };
    } else {
      authLink.href = `${basePath}/login.html`;
      authLink.textContent = 'Log In';
      authLink.onclick = null;
      if (currentPath.endsWith('/login.html')) authLink.classList.add('current');
    }
  };

  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    updateAuthLink(session);
  });

  supabaseClient.auth.onAuthStateChange((_, session) => updateAuthLink(session));

  document.body.prepend(nav);
}



window.addEventListener('DOMContentLoaded', renderNav);
