const urlParams = new URLSearchParams(window.location.search);
const imageId = urlParams.get('id');
var likeable = true
const likesText = document.getElementById("likes")

const likesButton = document.getElementsByClassName("likes-button")[0]

async function updateLikeCount() {

  const { count: likeCount } = await supabaseClient
  .from('reactions')
  .select('*', { count: 'exact', head: true })
  .eq('image_id', imageId);

  likesText.textContent = `👍 Like (${likeCount})`;
}

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
      
  document.title = imageItem.Name;
  var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = imageItem.image_url;

  await updateLikeCount()

  likesButton.onclick = async() => {
    console.log("Clicked")
    likeable = false
        likesButton.classList.add("disabled")
        setTimeout(()=> {
            likeable= true

            likesButton.classList.remove("disabled")
        }, 550)

    const { error } = await supabaseClient
    .from('reactions')
    .insert({ image_id: imageItem.id });

    await updateLikeCount()

    if(error){
      console.error(error)
    }
  }

  await loadComments();
};

const loadComments = async () => {
  const commentsContainer = document.getElementById("comments");
  commentsContainer.innerHTML = "";

  const { data: comments, error: commentError } = await supabaseClient
    .from('comments')
    .select('id, comment, created_at, user_id')
    .eq('image_id', imageId)
    .order('created_at', { ascending: true });

  if (commentError) {
    console.error("Error loading comments:", commentError.message);
    return;
  }

  const userIds = comments.map(comment => comment.user_id).filter(Boolean); 

  let userMap = {};
  if (userIds.length > 0) {
    const { data: users, error: userError } = await supabaseClient
      .from('users') 
      .select('id, email')
      .in('id', userIds);

    if (userError) {
      console.error("Error loading users:", userError.message);
    } else {
      // Create a map of user_id -> email
      userMap = Object.fromEntries(users.map(user => [user.id, user.email]));
    }
  }

  comments.forEach(comment => {
    let newComment = document.createElement("div");
    newComment.classList.add("comment");

    const userEmail = userMap[comment.user_id] || "anon";

    newComment.textContent = `${comment.comment} - ${userEmail}`;
    commentsContainer.appendChild(newComment);
  });
};



const addComment = async () => {
  const commentInput = document.getElementById("commentInput");
  const commentText = commentInput.value.trim();
  if (!commentText) {
    alert("Comment can't be empty!");
    return;
  }

  const { data: { session } } = await supabaseClient.auth.getSession();
  const userId = session?.user?.id; 



  const { error } = await supabaseClient.from('comments').insert({
    image_id: imageId,
    comment: commentText,
    user_id: userId || null, 
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error("Error inserting comment:", error);
    alert(`Error: ${error.message}`);
    return;
  }

  console.log("Comment added successfully!");
  commentInput.value = "";
  loadComments();
};

const displayUserName = async () => {
  const userDisplay = document.getElementById("user-display");
  const { data: { session } } = await supabaseClient.auth.getSession();
  userDisplay.textContent = session?.user?.email || "anon";
};

window.addEventListener('DOMContentLoaded', () => {

    const commentInput = document.getElementById("commentInput");

  commentInput.value = "";
  fetchImageData();
  displayUserName();
  document.getElementById("submitComment").onclick = addComment;


  
});
