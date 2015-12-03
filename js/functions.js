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
		// Clear all jobs, all classes and the timetable
		$('#jobs').empty();
		$('#classes').empty();
		
		// Hide classes and timetable
		$('#classes').hide();
		$('#timetable').hide();
		
		// Add placeholder and load jobs
		$('#jobs').append('<option value="-">-</option>');
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
	// Show classes
	$('#classes').show();
	
	// Get JSON
	$.getJSON(url, function(classes) {
		// Add option for each class to select
		$.each(classes, function(cl) {
			$('#classes').append('<option value="' + classes[cl].klasse_id + '">' + classes[cl].klasse_longname + ' - ' + classes[cl].klasse_name + '</option>');
		});
		// When class selected from dropdown get value and call getHours
		$('#classes').on('change', function() {
			var classID = $('#classes').val();

			// Get current week and year
			var date = new Date();
			var weekNumber = getCurrentWeek(date);
			var year = (new Date).getFullYear();

			var hoursUrl = 'http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + classID + '&woche=' + weekNumber + '-' + year;
			// Get week and get year
			getHours(hoursUrl);
		});
	});
};

// Get hours
function getHours(url) {
	// Show table
	$('#timetable').show();

	// Get JSON
	$.getJSON(url, function(hours) {
		// Add content to table
		console.log(hours);
		$.each(hours, function(hour) {
			var id = hours[hour].tafel_id;
			$('#content').append('<tr id="' + id + '"></tr>');
			$('#' + id).append('<td>' + hours[hour].tafel_datum + '</td>'); // Append to id with tafel_id
			$().append('<td>' + hours[hour].tafel_wochentag + '</td>');
			$().append('<td>' + hours[hour].tafel_von + ' - ' + hours[hour].tafel_bis + '</td>');
			$().append('<td>' + hours[hour].tafel_lehrer + '</td>');
			$().append('<td>' + hours[hour].tafel_longfach + '</td>');
			$().append('<td>' + hours[hour].tafel_fach + ' - ' + hours[hour].tafel_datum + '</td>');
			$().append('<td>' + hours[hour].tafel_raum + '</td>');
			$().append('<td>' + hours[hour].tafel_kommentar + '</td>');
		});
	});
};

// Return number of current week
function getCurrentWeek(date) {
	var january = new Date(date.getFullYear(),0,1);
	return Math.ceil((((date - january) / 86400000) + january.getDay()+1)/7);
};


































