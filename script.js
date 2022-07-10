  // Golbal variables

  // Variables you can alter
  var api_key = "AIzaSyB-ekXbFBVHXyAqnQ3-ggCtrJUKabCqko8"
  var max_results = 20
  var region = ""
  var cats_allowed = ["Pets & Animals", "Gaming", "Videoblogging", "People & Blogs", "Entertainment", "Comedy", "Family"]
  var same_cats = true



  // Internal Variables
  var data = []
  var name
  var id = null
  var l = []
  var ld = []
  var total = 0
  var wins = 0
  var cats_dic = {}


  // Fetch data from YoutubeV3 Api
  async function main() {
    $(".container").attr("id", "lock")
    $("#load").css("display", "block")
    //reset lists
    l = []
    ld = []
    data = []


    url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&key=${api_key}&maxResults=${max_results}`
    var cat_link = ""
    //Get Location
    if (region == "") {
      var lo = await fetch("https://ipinfo.io?token=7d327ed3e58d01")
      lo = await lo.json()
      // console.log(lo);
      url = url + `&regionCode=${lo.country}`
      cat_link = `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=${lo.country}&key=${api_key}`
    } else {
      url = url + `&regionCode=${region}`
      cat_link = `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=${region}&key=${api_key}`
    }
    //Get categories
    var cats_list = []
    var cats = await fetch(cat_link)
    cats = await cats.json()
    // console.log(cats);
    cats_l = ""
    x = 0
    for (i = 0; i < cats.items.length; i++) {

      if (cats_allowed.includes(cats.items[i].snippet.title)) {
        cats_dic[cats.items[i].id] = cats.items[i].snippet.title
        if (x == 0) {
          cats_l = cats.items[i].id
          cats_list.push(cats.items[i].id)
        } else {
          cats_l = cats_l + `,${cats.items[i].id}`
          cats_list.push(cats.items[i].id)
        }
        x++
      }
    }

    for (i = 0; i < cats_list.length; i++) {
      //fetch data
      try {
        data_temp = await fetch(url + `&videoCategoryId=${cats_list[i]}`);
        data_temp = await data_temp.json()
        for (z = 0; z < data_temp.items.length; z++) {
          data_temp.items[z].cat = cats_list[i]
        }
        data = [...data, ...data_temp.items]
      } catch (e) {

      }
    }
    // console.log(data);
    // console.log("done fetching");

    //setup random list
    l = [...Array(data.length).keys()]
    ld = l.slice()

    utilize()
    $(".container").attr("id", "")
    $("#load").css("display", "none")

  }

  // Go to next question
  function utilize() {

    //filter dublicates
    //played = filterDublicates(played);

      if (l.length > 0) {

        var randomNum = l[randomize(0, l.length - 1)];
        id = randomNum
        //console.log(data.items[randomNum]);
        name = data[randomNum].snippet.channelTitle;

        // Checking if channel name is in the title and if so, hiding it
        title = data[randomNum].snippet.title
        title_edited = title
        var seq = false
        for (sp of name.split(" ")) {
          var old = title_edited
          if (sp.length > 1) {
            if (seq == false) {
              title_edited = title_edited.replaceAll(sp, `<div class = "badge badge-light mr-1">hidden</div>`)
            } else {
              title_edited = title_edited.replaceAll(sp, "")
            }
          }

          if (old != title_edited) {
            seq = true
          } else {
            seq = false
          }

        }
        $("#title").html(title_edited)


        l.splice(l.indexOf(randomNum), 1)
        $("#ops").attr("data-l", "0")
        addOps()

      } else {
        alert(`That's all for now, Please come back later`)
        $("#total_score").html(`<b>Total Score:</b> ${wins}/${total} or ${Math.round(wins*100/total)}%`)
        $("#total_score").css({display: "inline-block"})
      }



  }

  // Skip current Question
  function skipOps() {
    utilize()
    if (total != 0 && l.length != 0) {
      $("#percent").text(`${Math.round(wins*100/total)}%`)
      $("#score").text(`${wins}`)
    }
  }

  // Show answer
  function showAns() {
    if ($("#ops").attr("data-l") == "1") {
      return
    }
    $("#ops").attr("data-l", "1")
    for (i = 1; i <= 4; i++) {
      if ($(`#op_${i}`).text() == name) {
        $(`#op_${i}`).css("background-color", "green")
      }
    }
    total++
    //alert("Incorrect Answer , Correct answer is : " + name);
    if (total != 0) {
      $("#percent").text(`${Math.round(wins*100/total)}%`)
      if (total == 0 && score == 0) {
        $("#score").text("0")
      } else {
        $("#score").text(`${wins}`)
      }
    }
    //utilize();

  }

  // Create Option to choose from
  function addOps() {
    var cCat = data[id].cat
    var lc = ld
    if (same_cats == true) {
      lc = []
      ld.forEach((i, x) => {
        if (data[i].cat == cCat) {
          lc.push(i)
        }
      })
    }
    // console.log("lc: ");
    // console.log(lc);
    var c = randomize(1, 4)
    // l.splice(l.indexOf(id), 1)
    lc.splice(lc.indexOf(id), 1)
    $(`#op_${c}`).text(name)
    $("#cat").text(cats_dic[cCat])
    var added = []
    for (i = 1; i <= 4; i++) {
      $(`#op_${i}`).css("background-color", "#5a6268")
      $(`#op_${i}`).hover(function() {
        $(this).css("background-color", "#3b4044");
      }, function() {
        $(this).css("background-color", "#5a6268");
      });
      if (i == c) {
        continue
      }
      var rIndex = randomize(0, lc.length - 1)
      while (added.includes(data[lc[rIndex]].snippet.channelTitle)) {
        rIndex = randomize(0, lc.length - 1)
      }
      $(`#op_${i}`).text(data[lc[rIndex]].snippet.channelTitle)
      // console.log(data[lc[rIndex]].cat);
      added.push(data[lc[rIndex]].snippet.channelTitle)
      lc.splice(lc.indexOf(rIndex), 1)
    }
  }

  // Create Whether answer provided is correct or not
  function checkAnsOps(obj) {
    if ($("#ops").attr("data-l") == "1") {
      return
    }
    $("#ops").attr("data-l", "1")
    var ans = $(obj).text()
    // console.log(`${ans} : ${name}`);
    if (ans == name) {
      $(obj).unbind('mouseenter mouseleave');
      $(obj).css("background-color", "green")
      wins++
      total++
      if (total != 0) {
        $("#percent").text(`${Math.round(wins*100/total)}%`)
        if (total == 0 && score == 0) {
          $("#score").text("0")
        } else {
          $("#score").text(`${wins}`)
        }
      }

      //alert(`Correct Answer (${name}) , Taking you to the next question....`);
      //utilize();
    } else {
      $(obj).attr("data-l", "1")
      $(obj).unbind('mouseenter mouseleave');
      $(obj).css("background-color", "red")
      for (i = 1; i <= 4; i++) {
        if ($(`#op_${i}`).text() == name) {
          $(`#op_${i}`).unbind('mouseenter mouseleave');
          $(`#op_${i}`).css("background-color", "green")

        }
      }
      total++
      //alert("Incorrect Answer , Correct answer is : " + name);
      if (total != 0) {
        $("#percent").text(`${Math.round(wins*100/total)}%`)
        if (total == 0 && score == 0) {
          $("#score").text("0")
        } else {
          $("#score").text(`${wins}`)
        }
      }

      //utilize();
    }

  }

  // Helper functions
  function randomize(min, max) {
    return Math.floor((max - min) * Math.random() + min)
  }

  function endErr(err) {
    alert("An Error Occured: Please try again later!")
    $("body").text(err)
  }

  function filterDublicates(arr) {
    var filtered = [];

    //filter dublicates
    arr.forEach((item, i) => {
      if (!filtered.includes(item)) {
        filtered.push(item);
      }
    });
    return filtered;
  }

  // Start game
  main()
