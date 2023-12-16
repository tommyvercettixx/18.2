document.addEventListener('DOMContentLoaded', function () {

    fetch('http://127.0.0.1:5000/posts')
        .then(response => {
            if(!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(posts => {

            posts.forEach(function(post) {
                let card = $("<div>").addClass("card mt-3");

                if (post.filename) {
                    let imgElement = $("<img>").addClass("card-img-top").attr("src", post.filename).attr("alt")
                    card.append(imgElement);
                }

                let cardBody = $("<div>").addClass("card-body");
                card.append(cardBody);

                if (post.title) {
                    let titleElement = $("<h5>").addClass("card-title").text(post.title);
                    cardBody.append(titleElement);
                }

                if (post.content) {
                    let contentElement = $("<p>").addClass("card-text").text(post.content);
                    cardBody.append(contentElement);
                }

                $("#wall").append(card);
            });
        })
        .catch(error => {
            console.error('Error creating post:', error);
        });


    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();

        var fileInput = document.getElementById('fileInput').files[0];
        var postTitle = document.getElementById('postTitle').value;
        var postContent = document.getElementById('postText').value;

        var formData = new FormData();
        formData.append('file', fileInput);
        formData.append('title', postTitle);
        formData.append('content', postContent);

        fetch('http://127.0.0.1:5000/posts/create', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            document.getElementById('postTitle').value = "",
            document.getElementById('postText').value = "";
            document.getElementById('fileInput').value = "";
            return response.json();
        })
        .then(post => {

            let card = $("<div>").addClass("card mt-3");

            if (post.filename) {
                let imgElement = $("<img>").addClass("card-img-top").attr("src", post.filename).attr("alt")
                card.append(imgElement);
            }

            let cardBody = $("<div>").addClass("card-body");
            card.append(cardBody);

            if (post.title) {
                let titleElement = $("<h5>").addClass("card-title").text(post.title);
                cardBody.append(titleElement);
            }

            if (post.content) {
                let contentElement = $("<p>").addClass("card-text").text(post.content);
                cardBody.append(contentElement);
            }

            $("#wall").append(card);

        })
        .catch(error => {
            console.error('Error creating post:', error);
        })
    });
});