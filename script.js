document.addEventListener('DOMContentLoaded', () => {
/** 1. DOMContentLoaded Event
•Purpose: Ensures the JavaScript runs after the HTML is fully loaded. This is crucial for manipulating DOM elements that might not
 exist if the script runs too early.*/

    // 2. Variables and Element Selection
    const inputBox = document.getElementById('InputBox');
    /*inputBox:Retrieves the input element where results are displayed.
    Uses getElementById to find the element with the ID InputBox.*/

    // Select all buttons
    const buttons = document.querySelectorAll('button');
    /*buttons:Retrieves all button elements on the page.
    Uses querySelectorAll to select every <button> element.*/

    // Initialize current input as an empty string
    let currentInput = '';
    /*currentInput:Initializes an empty string to store the user's input sequence.*/

    //3. Button Event Listeners
    buttons.forEach(button => {
        button.addEventListener('click', () => {
             /* Loop through buttons:Uses forEach to add a click event listener to each button.*/

             //. Handling Button Clicks
             const value = button.textContent;
             /*Get Button Value:Retrieves the text content of the clicked button, which represents its value or operation..*/
             
            //   Button Operation 
            // Handle AC button to clear input
            if (value === 'AC') {
                currentInput = '';
                inputBox.value = '0';
            }
            /*
            1.AC (All Clear) Button:
            Clears the currentInput.
            Sets the inputBox value to '0'.*/ 

            // Handle DEL button to delete last character
            else if (value === 'DEL') {
                currentInput = currentInput.slice(0, -1);
                inputBox.value = currentInput || '0';
                }
            /*.DEL (Delete) Button:
            Removes the last character from currentInput.
            Updates the inputBox, showing '0' if currentInput is empty.*/

            // Handle = button to evaluate the expression
            else if (value === '=') {
                try {
                    currentInput = eval(currentInput).toString();
                    inputBox.value = currentInput;
                } catch {
                     //Display error message if evaluation fails
                    inputBox.value = 'Error';
                    currentInput = '';
                }
            }
            /*Equals (=) Button:
            Evaluates the expression stored in currentInput using eval.
            Updates inputBox with the result or displays 'Error' if the evaluation fails.*/


            /*Number and Operator Buttons
            Handle number and operator buttons*/ 
            else {
                if (inputBox.value === '0' && value !== '.') {
                    currentInput = '';
                }
                currentInput += value;
                inputBox.value = currentInput;
            }

            /*Appends the button's value to currentInput.
            Clears the leading '0' if not a decimal point.
            Updates the inputBox with the new currentInput.*/

        });
    });
    
});
