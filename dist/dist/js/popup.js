const
	keywordData = JSON.parse(localStorage["keyword"]),
	settings = JSON.parse(localStorage["params"]),
	enabledExtension = settings["enabled"],
	start = document.getElementById("start"),
	//check if keywords are configured
	isKwInstalled = () => keywordData[0]['keyword'] != '' ? true : false,
	startBot = () => {
		if (localStorage['data'].length > 4) {

			chrome.runtime.sendMessage({msg: 'startBot'})

			var currentDate = new Date()
			var minutes = currentDate.getMinutes() < 10 ? "0" + "" + currentDate.getMinutes() : currentDate.getMinutes()
			var seconds = currentDate.getSeconds() < 10 ? "0" + "" + currentDate.getSeconds() : currentDate.getSeconds()
			var nowTime = currentDate.getHours() + "" + minutes + "" + seconds
			var startTime = parseInt(settings["startTime"].replace(/:/g, ""))

			if (Number.isInteger(startTime) && nowTime < startTime)
				loaderCountdown(settings["startTime"])
			else
				$("#loader").html("<u>" + gM("loader") + "</u>")

			$("#loader").fadeIn("fast")

			start.className = 'button disabled'
			start.disabled = true
			start.onclick = null
			
		} else {
			alert(gM('fillDatas'))
		}
	}
	loaderCountdown = startTime => {
		var separation = startTime.split(':')
		var startSeconds = (+separation[0]) * 60 * 60 + (+separation[1]) * 60 + (+separation[2])
		var refresh = setInterval(() => {
			let currentDate = new Date()
			let nowTime = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds()
			let separationNow = nowTime.split(':')
			let nowSeconds = (+separationNow[0]) * 60 * 60 + (+separationNow[1]) * 60 + (+separationNow[2])
			let seconds = startSeconds - nowSeconds
			if (seconds == 0) {
				clearInterval(refresh)
				$("#loader").html("<u>" + gM("loader") + "</u>")
			} else
				$("#loader").html(gM("startAt", seconds))
		}, 1000)
	}

if (isKwInstalled() && enabledExtension) {
	start.className = 'button start'
	start.disabled = false
	start.onclick = startBot
}

document.getElementById("nbkws").innerHTML = (() => {
	var nb = keywordData[0]['keyword'] != '' ? Object.keys(keywordData).length : 0

	return '<b>' + gM('nbKeywords', nb) +'</b>'
})()

document.getElementById('settings').onclick = () => chrome.tabs.create({ url: location.href.replace("popup", "settings") })
document.getElementById('docu').onclick = () => chrome.tabs.create({ url: "https://copit.fr/doc"})

start.value = gM("startVal")
document.getElementById('settings').value = gM("settings")
document.getElementById('docu').value = gM('documentation')