let likeable = true

async function fetchImages() {
    likeable = false
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
  
      const title = document.createElement("h1")
      title.innerHTML = item.Name
      

      
      const img = document.createElement('img');
      img.style.width = "100%";
      img.style.height = "100%";
      img.src = item.image_url;
      img.classList.add("gallery-image")

      const image_link = document.createElement("a")
      image_link.href = `./image.html?id=${item.id}`;



      image_link.appendChild(img)
    
      const likeBtn = document.createElement('button');
      likeBtn.textContent = "👍 Like (0)";
      
      const { count: likeCount } = await supabaseClient
        .from('reactions')
        .select('*', { count: 'exact', head: true })
        .eq('image_id', item.id);
  
      likeBtn.textContent = `👍 Like (${likeCount})`;
      likeBtn.onclick = async () => {
        if(!likeable) return
        likeable=false
        likeBtn.classList.add("disabled")
        setTimeout(()=> {
            likeable= true

        likeBtn.classList.remove("disabled")
        }, 550)
        const { error } = await supabaseClient
          .from('reactions')
          .insert({ image_id: item.id });
      
        if (error) {
          console.error("Reaction failed:", error);
          alert('❌ Unable to like. Please try again.');
        } else {
            // find a way to update the like count without a full refresh
            likeBtn.textContent =`👍 Like (${likeCount+1})`
        }
      };
      
  
      const commentsDiv = document.createElement('div');
      commentsDiv.className = 'comments';
  
   
      const inputsDiv = document.createElement("div")
      inputsDiv.style.display = "flex"

      const commentInput = document.createElement('input');
      commentInput.placeholder = 'Write a comment...';
  
      const commentBtn = document.createElement('button');
      commentBtn.textContent = 'Comment';


      commentBtn.onclick = async () => {
        window.location= `./image.html?id=${item.id}`;
      };
  
      container.appendChild(title);
      container.appendChild(image_link);
      container.appendChild(inputsDiv);
      inputsDiv.appendChild(likeBtn);
      inputsDiv.appendChild(commentBtn);
  
      likeable = true
      gallery.appendChild(container);
    });
  }
  
  fetchImages();
  