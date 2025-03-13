
var supabaseUrl = 'https://aeawxdmvlltkckeoqmfy.supabase.co';
var supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlYXd4ZG12bGx0a2NrZW9xbWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MTcxNDUsImV4cCI6MjA1NzM5MzE0NX0.cKlkkL0TI-8NArepWrHtXMxgU4ytB_bqp8oAyPDGzbE";

var supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const uploadSection = document.getElementById('upload-section');
const uploadStatus = document.getElementById('upload-status');

const fileNameInput = document.querySelector('input#fileName')
let fileName = ""


fileNameInput.addEventListener('input', ()=>{
    fileName =fileNameInput.value
});


supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session) {
    uploadSection.style.display = 'block';
  } else {
    window.location = "../login.html"

  }
});

document.getElementById('upload-btn').addEventListener('click', uploadImage);

async function uploadImage() {
  const fileInput = document.getElementById('image-input');
  if (fileInput.files.length === 0) {
    uploadStatus.textContent = '⚠️ Select an image first.';
    return;
  }

  const file = fileInput.files[0];
  const filePath = fileName + '-' + file.name;

  uploadStatus.textContent = 'Uploading... ⏳';

  const { data, error } = await supabaseClient.storage
    .from('gallery-images')
    .upload(filePath, file);




  if (error) {
    uploadStatus.textContent = `❌ Upload failed: ${error.message}`;
  } else {
    // Get Public URL of the uploaded image
    const { data: { publicUrl } } = supabaseClient.storage
      .from('gallery-images')
      .getPublicUrl(data.path);

    // Insert into your 'images' table clearly after upload
    const { error: dbError } = await supabaseClient
      .from('images')
      .insert({ image_url: publicUrl });

    if (dbError) {
      uploadStatus.textContent = `❌ Upload succeeded, but DB insert failed: ${dbError.message}`;
      return;
    }

    uploadStatus.textContent = `✅ Uploaded and recorded successfully!`;
  }
}
