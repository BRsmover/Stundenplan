// When document is ready
$(document).ready(function() {
	// URL to get data from
	var jobUrl = 'http://home.gibm.ch/interfaces/133/berufe.php';
	// Calling method to get jobs
	getJobs(jobUrl);
// 	getJobs('data.json');
});

// Get jobs
function getJobs(url) {
	// Get JSON
	$.getJSON(url, function(jobs) {
		// Add option for each job to select
		$.each(jobs, function(job) {
			$('#jobs').append('<option value="' + jobs[job].beruf_id + '">' + jobs[job].beruf_name + '</option>');
		});
		// When job selected from dropdown get value and call getClasses()
		$('#jobs').on('change', function() {
			var jobID = $('#jobs').val();
			var classUrl = 'http://home.gibm.ch/interfaces/133/klassen.php?beruf_id=' + jobID;
			getClasses(classUrl);
		});
	});
};

// Get classes
function getClasses(url) {
	// Add new dropdown
	$('.container').append("<select id='classes' class='form-control'></select>");

	// Get JSON
	$.getJSON(url, function(classes) {
		// Add option for each class to select
		$.each(classes, function(cl) {
			$('#classes').append('<option value="' + classes[cl].klasse_id + '">' + classes[cl].klasse_longname + ' - ' + classes[cl].klasse_name + '</option>');
		});
		// When class selected from dropdown get value and call getHours
		$('#classes').on('change', function() {
			var classID = $('#classes').val();
			var hoursUrl = 'http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + classID + '&woche=' + '44-2012';
			// Get week and get year
			getHours(hoursUrl);
		});
	});
};

// Get hours
function getHours(url) {
	// Add new dropdown
	var thead = "<thead><tr><th>Datum</th><th>Wochentag</th><th>Von</th><th>Bis</th><th>Lehrer</th><th>Fach</th><th>Raum</th><th>Kommentar</th></tr></thead>";
	$('.container').append("<table id='hours' class='table table-hover table-responsive'>" + thead + "<tbody id='content'></tbody></table>");

	// Get JSON
	$.getJSON(url, function(hours) {
		// Add content to table
		$.each(hours, function(hour) {
			$('#content').append('<tr><td>' + hours[hour].tafel_datum + '</td></tr>');
		});
	});
};
