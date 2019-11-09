$(document).on("click", "#addNote", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    $.ajax({
        method: "GET",
        url: "/news/" + thisId
    })
    .then(function (data){        
        $(".modal-title").text(data.title);
        // console.log(data.note);
        if (data.note){
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#submitActivity", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    $.ajax({
        method: "POST",
        url: "/news/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function (data) {
        console.log(data);
    });

    // $("#titleinput").val("");
    // $("#bodyinput").val("");
});