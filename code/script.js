document.addEventListener('DOMContentLoaded', function() {
    const recordForm = document.getElementById('recordForm');
    const upcomingActivities = document.getElementById('upcomingActivities');
    const dateInput = document.getElementById('date');
    const alarmAudio = document.getElementById('alarmAudio');

    // Replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API key
    const apiKey = 'AIzaSyBbLfs6lanbN68v1H8sldQL4dz0sAuqlMM';

    // Request notification permission on page load
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // Speak "/nHave a great day!" when the page loads
    speak("Have a great day!");

    // Function to handle form submission
    recordForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const activity = document.getElementById('activity').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        if (activity && date && time) {
            const dateTime = new Date(`${date}T${time}`);
            const now = Date.now();

            if (dateTime > now) {
                const activityItem = document.createElement('div');
                activityItem.classList.add('upcoming-activity');
                activityItem.textContent = `${activity} - ${dateTime.toLocaleString()}`;

                upcomingActivities.appendChild(activityItem);

                // Schedule alert
                const timeDifference = dateTime.getTime() - now;
                setTimeout(() => {
                    notifyUser(activity);
                }, timeDifference);

                // Call Gemini API example (replace with your actual API endpoint and method)
                fetchGeminiData();

                // Clear form fields
                document.getElementById('activity').value = '';
                document.getElementById('date').value = '';
                document.getElementById('time').value = '';
            } else {
                alert('Please select a future date and time.');
            }
        } else {
            alert('Please fill out all fields.');
        }
    });

    // Function to notify user with voice, notification, and alarm
    function notifyUser(activity) {
        const message = `Time to ${activity}`;

        // Play alarm ringtone
        alarmAudio.play();
        
        // Wait for the audio to finish before speaking
        alarmAudio.onended = () => {
            // Desktop notification
            if (Notification.permission === 'granted') {
                new Notification(message);
            }
            // Voice alert
            speak(message);
            // Alert message
            alert(message);
        };
    }

    // Function to handle speaking messages
    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Specify language (optional)
        utterance.volume = 1; // 0 to 1
        utterance.rate = 1; // 0.1 to 10
        utterance.pitch = 1; // 0 to 2
        window.speechSynthesis.speak(utterance); // Speak immediately
    }

    // Function to fetch data from Gemini API (example)
    function fetchGeminiData() {
        // Example endpoint, replace with your actual Gemini API endpoint
        const url = 'https://api.gemini.com/v1/balances';

        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'X-GEMINI-APIKEY': apiKey,
            }
        })
        .then(response => response.json())
        .then(data => {
            // Process Gemini API response here
            console.log('Gemini API Response:', data);
        })
        .catch(error => {
            console.error('Error fetching data from Gemini API:', error);
        });
    }

    // Add event listener to date input for speaking on change
    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const dayOfWeek = getDayOfWeek(this.value);
        const quote = getQuote(dayOfWeek);
        speak(quote);

        // Optional: Highlight Sundays dynamically
        if (selectedDate.getDay() === 0) { // Sunday
            this.classList.add('highlight-sunday');
        } else {
            this.classList.remove('highlight-sunday');
        }
    });

    // Function to get the day of the week name
    function getDayOfWeek(dateString) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const selectedDate = new Date(dateString);
        const dayIndex = selectedDate.getDay();
        return daysOfWeek[dayIndex];
    }

    // Function to get a random quote based on the day of the week
    function getQuote(dayOfWeek) {
       switch (dayOfWeek) {
            case 'Sunday':
                return "Chill out, it's Sunday!";
            case 'Monday':
                return "Kickstart your week!";
            case 'Tuesday':
                return "Keep it going, it's Tuesday!";
            case 'Wednesday':
                return "Halfway there, happy Wednesday!";
            case 'Thursday':
                return "Almost Friday, you got this!";
            case 'Friday':
                return "It's Friday, time to unwind!";
            case 'Saturday':
                return "Enjoy your Saturday vibes!";
            default:
                return "Make it a great day!";
        }
    }
});
