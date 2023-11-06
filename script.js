(function () {
    const build = document.querySelector("meta[name='build']").content;

    function randChoice(arr) {
        arr = arr || []
        return arr[Math.floor(Math.random() * arr.length)]
    }

    $(window).init(function () {
        console.log("window init");

        const audio = $("#audio")
        const audioClip = $("#audio-clip")
        const optionsDiv = $("#options")
        const referenceDiv = $("#reference")
        const btnSubmit = $("#submit")
        let answer;

        audio.on('ended', function () {
            console.log('ended')
        })

        $(document).on('change', 'input[name="soundType"]', function (e) {
            const selected = $("input[name='soundType']:checked").attr('id');

            btnSubmit.attr("disabled", !selected)
        })

        function newTest() {
            const choices = []
            for (let key in TESTS) {
                if (key !== answer && TESTS[key].name !== "break") {
                    choices.push(key)
                }
            }
            answer = randChoice(choices)

            const randSound = randChoice(TESTS[answer].sounds)

            console.log(answer, randSound)

            try {
                audioClip.attr("src", `./audio/${randSound}?v=${build}`);
                audio[0].pause();
                audio[0].load();
                audio[0].oncanplaythrough = audio[0].play();
            } catch (e) {
                console.error(e)
            }

            $("input[name='soundType']").prop("checked", false)
        }

        Object.keys(TESTS).forEach(key => {
            const test = TESTS[key];
            if (test.name === "break") {
                optionsDiv.append("<hr>")
                referenceDiv.append("<hr>")
            } else {
                const iconsHtml = []
                test.icons.forEach(icon => {
                    iconsHtml.push(`<img src='./img/${icon}.png' width="20">`)
                })
                optionsDiv.append(`
                    <div class='${key}' class="form-check">
                      <input class="form-check-input sound-radio" type="radio" name="soundType" id="${key}">
                      <label class="form-check-label" for="${key}">
                        <div class="icons" style="width:80px;display:inline-block;" align="right">${iconsHtml.join("")}</div> 
                        <div class="name" style="display:inline-block;">${test.name}</div>
                        <div class="pass c0" style="display:inline-block;">0</div>
                        <div class="fail c0" style="display:inline-block;">0</div>
                      </label>
                    </div>
                `)

                const randSound = randChoice(TESTS[key].sounds)
                referenceDiv.append(`
                    <div class='sound-ref'>
                        <h6>${test.name} ${iconsHtml.join("")}</h6>
                        <audio controls preload="none"><source type="audio/mpeg" src="./audio/${randSound}?v=${build}"></audio>
                    </div>
                `)
            }
        })

        btnSubmit.click(function () {
            const selected = $("input[name='soundType']:checked").attr('id');
            const test = TESTS[answer];
            if (!test.pass) test.pass = 0
            if (!test.fail) test.fail = 0

            const resultModal = $("#resultModal")
            const resultTitle = $("#resultTitle")
            const resultContent = $("#resultContent")

            resultContent.html(`That was a ${test.name}.<div style="background-image:url('./img/${test.preview}');margin-top:15px;width:100%;height:250px;background-position:center;background-size:cover"></div>`)

            console.log(selected, '===', answer)
            if (selected === answer) {
                resultModal.addClass("correct").removeClass("wrong")
                resultTitle.html(`<i class="bi bi-check-circle-fill" style="color:greenyellow"></i> Correct`)

                test.pass += 1
                $(`.${answer} .pass`).text(test.pass).removeClass("c0")
            } else {
                resultModal.removeClass("correct").addClass("wrong")
                resultTitle.html(`<i class="bi bi bi-dash-circle" style="color:red"></i> Wrong`)

                test.fail += 1
                $(`.${answer} .fail`).text(test.fail).removeClass("c0")
            }

            newTest()
        })

        newTest()
    })
}());
