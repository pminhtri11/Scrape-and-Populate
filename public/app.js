$(".saveNews").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/saved/" + thisId
    }).then(function (data) {
        console.log(data);
        location.reload();
    });
});


// Add Note, see if any note already in this news
$(document).on("click", "#addNote", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    $.ajax({
        method: "GET",
        url: "/news/" + thisId
    })
        .then(function (data) {
            $(".modal-title").text(data.title);
            console.log(data);
            if (data.note) {
                console.log("Lmao")
                $("#bodyinput").val(data.note.body);
            }
        });
});


// Save Note
$(document).on("click", "#submitActivity", function () {
    var thisId = $(this).attr("data-id");
    // console.log(thisId);
    $.ajax({
        method: "POST",
        url: "/news/" + thisId,
        data: {
            body: $("#bodyinput").val()
        }
    }).then(function (data) {
        console.log("Hate You");
        location.reload();
    });

    // $("#titleinput").val("");
    // $("#bodyinput").val("");
});