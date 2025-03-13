var supabaseUrl = 'https://aeawxdmvlltkckeoqmfy.supabase.co';
var supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlYXd4ZG12bGx0a2NrZW9xbWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MTcxNDUsImV4cCI6MjA1NzM5MzE0NX0.cKlkkL0TI-8NArepWrHtXMxgU4ytB_bqp8oAyPDGzbE";

var supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Detect if running locally or on GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/resume' : '/resume'; 

function renderNav() {
  const nav = document.createElement('nav');
  nav.classList.add('navigation');


  const BrandInfo = document.createElement('div')
  BrandInfo.textContent = 'David Kozdra';
  nav.appendChild(BrandInfo);

  const resumeLink = document.createElement('a');
  resumeLink.href = `${basePath}/index.html`;
  resumeLink.textContent = 'Resume';
  nav.appendChild(resumeLink);

  const uploadLink = document.createElement('a');
  uploadLink.href = `${basePath}/upload/index.html`;
  uploadLink.textContent = 'Upload';
  nav.appendChild(uploadLink);

  const galleryLink = document.createElement('a');
  galleryLink.href = `${basePath}/gallery.html`;
  galleryLink.textContent = 'Gallery';
  nav.appendChild(galleryLink);


  const authLink = document.createElement('a');
  nav.appendChild(authLink);

  const updateAuthLink = (session) => {
    if (session) {
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
    }
  };

  supabaseClient.auth.getSession().then(({ data: { session } }) => {
    updateAuthLink(session);
  });

  supabaseClient.auth.onAuthStateChange((_, session) => updateAuthLink(session));

  document.body.prepend(nav);
}


window.addEventListener('DOMContentLoaded', renderNav);
