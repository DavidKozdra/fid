async function fetchImages() {
    const { data: images, error } = await supabaseClient
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error("Error fetching images:", error);
      return;
    }
  
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
  
    images.forEach(async (item) => {
      const container = document.createElement('div');
      container.className = 'image-card';
  
      
      const img = document.createElement('img');
      img.style.width = "100%";
      img.style.height = "100%";
      img.src = item.image_url;
  
      const likeBtn = document.createElement('button');
      likeBtn.textContent = "👍 Like (0)";
      
      const { count: likeCount } = await supabaseClient
        .from('reactions')
        .select('*', { count: 'exact', head: true })
        .eq('image_id', item.id);
  
      likeBtn.textContent = `👍 Like (${likeCount})`;
  
      likeBtn.onclick = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
          alert('Please login to like.');
          return;
        }
  
        const { error } = await supabaseClient.from('reactions').insert({
          image_id: item.id,
          user_id: session.user.id,
          reaction_type: "like"
        });
  
        if (error) {
    
            const { error: deleteError } = await supabaseClient.from('reactions')
            .delete()
            .match({ user_id: session.user.id, image_id: item.id });

            console.log(error)
            fetchImages();
        } 
        else fetchImages();
      };
  
      const commentsDiv = document.createElement('div');
      commentsDiv.className = 'comments';
  
      const { data: comments } = await supabaseClient
        .from('comments')
        .select('*')
        .eq('image_id', item.id)
        .order('created_at', { ascending: true });
  
   
      let inputsDiv = document.createElement("div")
      inputsDiv.style.display = "flex"

      const commentInput = document.createElement('input');
      commentInput.placeholder = 'Write a comment...';
  
      const commentBtn = document.createElement('button');
      commentBtn.textContent = 'Comment';


      commentBtn.onclick = async () => {
        const commentText = commentInput.value.trim();
        if (!commentText) return;
  
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
          alert('Please login to comment.');
          return;
        }
  
        fetchImages();
      };
  
      container.appendChild(img);
      container.appendChild(inputsDiv);
      inputsDiv.appendChild(likeBtn);
      inputsDiv.appendChild(commentBtn);
  
      gallery.appendChild(container);
    });
  }
  
  fetchImages();
  