const urlParams = new URLSearchParams(window.location.search);
const imageId = urlParams.get('id');

const likesText = document.getElementById("likes")

const fetchImageData = async () => {
  const { data: imageItem, error } = await supabaseClient
    .from('images')
    .select('*')
    .eq('id', imageId)
    .single();

  if (error || !imageItem) {
    console.error("Image not found:", error);
    return;
  }

  const image = document.getElementById("image");
  image.src = imageItem.image_url;
  image.classList.add("gallery-image")

  const name = document.getElementById("name");
  name.innerHTML = imageItem.Name || "Untitled";
      
  // update title based on the image name 
  document.title = imageItem.Name;
  var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = imageItem.image_url;
  const { count: likeCount } = await supabaseClient
  .from('reactions')
  .select('*', { count: 'exact', head: true })
  .eq('image_id', imageId);

likesText.textContent = `👍 Like (${likeCount})`;
  await loadComments();
};

const loadComments = async () => {
    
  const commentsContainer = document.getElementById("comments");
  commentsContainer.innerHTML = "";

  const { data: comments } = await supabaseClient
    .from('comments')
    .select('*')
    .eq('image_id', imageId)
    .order('created_at', { ascending: true });

  comments.forEach(comment => {
    let newComment = document.createElement("div");
    newComment.classList.add("comment");

    newComment.textContent = comment.comment + " -" + (comment.email || "anon");
    commentsContainer.appendChild(newComment);
  });
};

const addComment = async () => {
  const commentInput = document.getElementById("commentInput");
  const commentText = commentInput.value.trim();
  if (!commentText) return;

  await supabaseClient.from('comments').insert({
    image_id: imageId,
    comment: commentText,
  });

  commentInput.value = "";
  loadComments();
};

const displayUserName = async () => {
  const userDisplay = document.getElementById("user-display");
  const { data: { session } } = await supabaseClient.auth.getSession();
  userDisplay.textContent = session?.user?.email || "anon";
};

window.addEventListener('DOMContentLoaded', () => {
  fetchImageData();
  displayUserName();
  document.getElementById("submitComment").onclick = addComment;


  
});
