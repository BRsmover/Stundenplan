// When document is ready
$(document).ready(function() {

// URL to get data from
var jobUrl = 'http://home.gibm.ch/interfaces/133/berufe.php';
// Calling method to get jobs
getJobs(jobUrl);
//getJobs('data.json');

// Get jobs
function getJobs(url) {
	// Get JSON
	$.getJSON(url, function(jobs) {
		// Clear all jobs, all classes and the timetable
		$('#jobs').empty();
		$('#classes').empty();
		
		// Hide classes and timetable (with week switch)
		$('#classParagraph').hide();
		$('#classes').hide();
		$('#timetable').hide();
		$('#weekSwitcher').hide();
		
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
	// Show paragraph and classes
	$('#classParagraph').show();
	$('#classes').show();
	
	// Get JSON
	$.getJSON(url, function(classes) {
		// Add placeholder and load classes
		$('#classes').append('<option value="-">-</option>');
		$.each(classes, function(cl) {
			$('#classes').append('<option value="' + classes[cl].klasse_id + '">' + classes[cl].klasse_longname + ' - ' + classes[cl].klasse_name + '</option>');
		});
		// When class selected from dropdown get value and call getHours
		$('#classes').on('change', function() {
			var classID = $('#classes').val();

			// Get current week and year
			var weekNumber = getCurrentWeek();
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
	$('#timetable').fadeIn();

	// Get JSON
	$.getJSON(url, function(hours) {
		// Add content to table
		//console.log(hours);
		$.each(hours, function(hour) {
			var id = hours[hour].tafel_id;
			$('#content').append('<tr id="' + id + '"></tr>');
			$('#' + id).append('<td>' + hours[hour].tafel_datum + '</td>');
			$('#' + id).append('<td>' + getDay(hours[hour].tafel_wochentag) + '</td>');
			$('#' + id).append('<td>' + hours[hour].tafel_von + ' - ' + hours[hour].tafel_bis + '</td>');
			$('#' + id).append('<td>' + hours[hour].tafel_lehrer + '</td>');
			$('#' + id).append('<td>' + hours[hour].tafel_longfach + '</td>');
			$('#' + id).append('<td>' + hours[hour].tafel_raum + '</td>');
			$('#' + id).append('<td>' + hours[hour].tafel_kommentar + '</td>');
		});
	});

	if($('#weekNumber').length) {
		// The field already exists
	} else {
		// Show week switch buttons
		$('<li id="weekNumber"><a href="#">' + getCurrentWeek() + '</a></li>').insertAfter('#previous');
		$('#weekSwitcher').fadeIn();
	}
};

// Function to get number of current week as seen on:
// http://zerosixthree.se/snippets/get-week-of-the-year-with-jquery/
function getCurrentWeek() {
	var date = new Date();
	var january = new Date(date.getFullYear(),0,1);
	return Math.ceil((((date - january) / 86400000) + january.getDay()+1)/7);
};

// Get Weekday from number
function getDay(number) {
	var weekdays = new Array('Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag');
	return weekdays[number];
};

// Switch to previous week
$('#previous-link').click(function() {
	var classID = $('#classes').val();
	var week = parseInt($('#weekNumber').text(), 10);
	//console.log('week ' + week);
	week = week - 1;
	var year = (new Date).getFullYear();
	if (week == 0) {
		year = year - 1 ;
		week = 52;
		//console.log('Old year');
		// Overwrite week number
		$('#weekNumber').replaceWith('<li id="weekNumber"><a href="#">' + week + '</a></li>')
		// Empty tbody
		$('#content').empty();
		// Fill with new data
		getHours('http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + classID + '&woche=' + week + '-' + year);
	} else {
		//console.log('Still the same year...');
		// Overwrite week number
		$('#weekNumber').replaceWith('<li id="weekNumber"><a href="#">' + week + '</a></li>')
		// Empty tbody
		$('#content').empty();
		// Fill with new data
		getHours('http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + classID + '&woche=' + week + '-' + year);
	}
});

// Switch to next week
$('#next-link').click(function() {
	var classID = $('#classes').val();
	var week = parseInt($('#weekNumber').text(), 10);
	//console.log('week ' + week);
	week = week + 1;
	var year = (new Date).getFullYear();
	if (week == 53) {
		year = year + 1 ;
		week = 1;
		//console.log('New year');
		// Overwrite week number
		$('#weekNumber').replaceWith('<li id="weekNumber"><a href="#">' + week + '</a></li>')
		// Empty tbody
		$('#content').empty();
		// Fill with new data
		getHours('http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + classID + '&woche=' + week + '-' + year);
	} else {
		//console.log('Still the same year...');
		// Overwrite week number
		$('#weekNumber').replaceWith('<li id="weekNumber"><a href="#">' + week + '</a></li>')
		// Empty tbody
		$('#content').empty();
		// Fill with data
		getHours('http://home.gibm.ch/interfaces/133/tafel.php?klasse_id=' + classID + '&woche=' + week + '-' + year);
	}
});

}); // $(document).ready()
