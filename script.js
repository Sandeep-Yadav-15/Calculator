// ======= GETTING HTML ELEMENTS =======
// Get the <span> element that will show the expression (dim text on top)
const expressionSpan = document.getElementById("expression");//Finds the HTML element with id="expression" (the top display where dim text like 
// 5 + or 5 + 6 = 
// will show). Stores it in the variable expressionSpan.

// Get the <span> element that will show the current number/result (bright text on bottom)
const currentSpan = document.getElementById("current");//Finds the HTML element with id="current" (the main display where the number or result 
// is shown in bright color).
//  Stores it in currentSpan.

// Get all <button> elements in the calculator (for highlighting on key press)
const buttons = document.querySelectorAll("button");//Gets all <button> elements in the HTML (so we can add visual effects like highlighting 
// when a key is pressed). 
// Stores them in buttons as a list (NodeList).



// ======= CALCULATOR STATE VARIABLES =======
// Stores the current number being typed or result after calculation
let currentInput = "0"; // Abhi jo number type ho raha hai ya display me hai usko store karta hai. Shuru me "0" hota hai.

// Stores the first number entered before an operator
let firstOperand = null; //Operator press karne se pehle ka pehla number store karta hai. (jaise 5 in "5 + 6")

//  Will store the selected operator (+, -, *, /, %).
let operator = null; // Current operator

// true means the calculator is waiting for the user to type the second number after pressing an operator.
let waitingForSecondOperand = false; // True jab operator press ho chuka hai

// Flag to check if the last button pressed was '='
let lastWasEquals = false; // Agar ye true hai toh iska matlab last action equal (=) tha

// String that holds the top dim text (full expression before result)
let expressionText = ""; // Upar wali dim line ka text store karta hai, jaise 5 + 6 =.

let lastOperator = null; // Last operator for repeat calculation

let lastOperand = null; // Last operand for repeat calculation
//These store the last operator and last second number used, so the calculator can repeat the calculation when you press = multiple times.


// ======= FUNCTION: Update the display =======
/*This function updates the calculator's display:*/
function updateDisplay() {//Declares the updateDisplay function that refreshes what the user sees on the calculator screen.
    // Expression stays as-is
    expressionSpan.textContent = expressionText;//Sets the top (dim) span to show the current expression string (e.g. "5 + 6 =").

    // Format only if it's a number (not "Error")
    if (!isNaN(currentInput) && currentInput !== "") {/*Ye check karta hai ki currentInput number hai (jaise "1234"), aur blank nahi hai.
         Sirf numeric values ko hi number-format aur commas diye jayenge.*/
        // Split into integer and decimal parts
        let [intPart, decPart] = currentInput.split(".");//currentInput = "1234.56"
        /*Splits the currentInput string at the decimal point into two parts:
          intPart = integer portion (left of .)"1234"
          decPart = fractional/decimal portion (right of .)"56" — Agar "2000" may be undefined if no decima*/

        // Format integer part with commas
        intPart = Number(intPart).toLocaleString("en-US");
        /*Converts the integer part to a Number and applies locale formatting so thousands separators (commas) are added.
         Example: 1234567 → "1,234,567". Using toLocaleString "en-US" forces comma separators.*/

        // Recombine if decimal part exists
        currentSpan.textContent = decPart !== undefined ? `${intPart}.${decPart}` : intPart;
        /*Re-constructs the displayed string:
          If there is a decimal part, show "intPart.decPart" (e.g. 1,234.56)
          Otherwise show just the formatted integer part (e.g. 1,234).*/
    } else {
        //If the currentInput is not numeric (e.g., "Error"), use the else branch.
        // Show as-is for errors or non-numbers
        currentSpan.textContent = currentInput;
        //Puts the raw currentInput text into the display (used for "Error" or other non-number strings).
    }//End of the numeric-vs-non-numeric branch.
    // Auto font-size adjust
    if (currentSpan.textContent.length > 12) {/*Agar displayed text 12 se zyada characters ho gaya (commas bhi count honge),
         toh shrink class add karenge jisse font-size kam ho jaayega.*/
        currentSpan.classList.add("shrink");//Adds the CSS class shrink (your CSS defines a smaller font-size) so the text becomes smaller and fits.
    } else {//If length is 12 or less, remove the shrink effect so the number uses the normal (larger) font
        currentSpan.classList.remove("shrink");//Removes the shrink class so the display goes back to normal font-size.
    }//End of if/Else Function
}//End of updateDisplay() function.

/*Display ke dono parts update karta hai:
Upar wali dim line me expressionText dikhata hai.(like "5 + 6").
Neeche bright number/result me currentInput dikhata hai.*/
/*So, whenever I call updateDisplay(), it refreshes what the user sees on the calculator screen. */


// ======= FUNCTION: Append number or decimal =======
/*Purpose
This function handles what happens when a user presses a number or decimal button on the calculator. */
function append(num) {//Current number ke end me digit ya decimal point add karta hai.
// If result from =, start fresh
    if (lastWasEquals) {// If the last button was =, we start a new calculation.
        currentInput = num;       // Start fresh with new number
        expressionText = "";      // Clear the expression line
        lastWasEquals = false;    // Reset the equals flag
        lastOperator = null;      // Reset repeat calculation
        lastOperand = null;       // Reset repeat calculation
    }
    //Replace the current number with the new one, clear the expression, reset all repeat-calc variables.

    else if (waitingForSecondOperand) {// If waiting for second number after an operator press
        currentInput = num;       // Start typing the second number
        waitingForSecondOperand = false; // No longer waiting
        //Current number ko naya input se replace karo aur waiting flag ko off karo.
    }else {//If neither of the above cases apply, it means we’re typing normally.
        //  Prevent overflow: allow max 16 digits (ignore decimal point)
        let plainDigits = currentInput.replace(".", ""); //→ removes the decimal point so it doesn’t count toward the limit.
        if (plainDigits.length >= 16 && num !== ".") return;/*→ stops adding new numbers once the count hits 16.
Decimal is still allowed if there isn’t one yet.
This will stop number entry at exactly 16 digits, just like Windows 11 Calculator.
If you want to also round results to 16 digits after operations, we can add formatting in performCalculation() too. */


        // Replace "0" with new number (unless it's a decimal)
        if (currentInput === "0" && num !== ".") {
            currentInput = num;
        } else {
            // Prevent multiple decimal points
            if (num === "." && currentInput.includes(".")) return;
            // Append digit or decimal to the current number
            currentInput += num;
        }
        /*Agar current number "0" hai aur naya input . nahi hai toh replace karo.
          Agar decimal (.) hai toh check karo ki already ek decimal toh nahi hai.
          Warna simply number append kar do. */
    }
    updateDisplay(); // Refresh display
//After all changes, update the display to reflect the new input.
}


// ======= FUNCTION: Set operator (+, -, *, /, %) =======

function setOperator(op) {//    Ye function operator ko argument ke roop me leta hai, jaise "+", "-", "*", "/".
    // If last was '=', start new operation with the current result
    if (lastWasEquals) {//Dekhta hai ki kya last action = tha. (Matlab hum ek naya operation start kar rahe hain result se).
        expressionText = currentInput + " " + op;      // Upar wali dim line me current number + operator dikhata hai (e.g., 11 +).
        firstOperand = parseFloat(currentInput);       // Current input ko number me convert karke firstOperand me store karta hai (e.g., 11).
        lastWasEquals = false;                         // Flag reset karta hai kyunki ab hum naya calculation start kar rahe hain.
    }else {//Agar last action = nahi tha, toh yeh part chalega.
        // If an operator is already set and second number is entered, calculate first
        if (operator && !waitingForSecondOperand) {//If an operator already exists AND we are not waiting for the second number, then perform the previous calculation first.
            calculate(); // This will also reset operator
            //Pehle ka calculation execute karega, aur operator ko reset karega.
        }
        firstOperand = parseFloat(currentInput);//Current input ko number me convert karke pehla number store karta hai.
        expressionText = firstOperand + " " + op;//Dim line me pehla number + operator set karta hai (e.g., 5 +).
    }
    operator = op;                     // operator variable me naye operator ko save karta hai.
    waitingForSecondOperand = true;    // Ab hum wait kar rahe hain user ke dusre number ke input ka.
    updateDisplay();                   //  Display ko update karta hai taki naya expression aur number user ko dikhe.
}//End of function.


// ======= HELPER FUNCTION: Perform the calculation =======
function performCalculation(a, b, op) {/*This function takes 3 inputs:
a → first number (operand 1)
b → second number (operand 2)
op → operator symbol (+, -, *, /, %) */
    let result = 0; // Variable to store result
    //Creates a variable result to store the answer after calculation

    // Perform calculation based on the operator
    switch (op) {
        case "+": result = a + b; break;
        case "-": result = a - b; break;
        case "*": result = a * b; break;
        case "/": result = b === 0 ? "Error" : a / b; break; // Prevent divide by zero
        case "%": result = a % b; break;
    }
    /*Uses a switch statement to check which operator was passed.
      Performs the correct math operation:
      + → addition
      - → subtraction
      * → multiplication
      / → division (special check: if b is 0, show "Error" to prevent divide-by-zero crash)
      % → modulus (remainder after division)
    */

    // Show full expression on top dim line
    expressionText = a + " " + op + " " + b + " =";//Ek string banata hai jaise "5 + 6 =" aur ise upar dim display me show karta hai.
    //  Trim result to 16 digits max (excluding decimal point & minus sign)
    if (!isNaN(result) && result !== Infinity && result !== -Infinity) {
        /*Checks if the result is a valid finite number.
!isNaN(result) → make sure it’s not "Not-a-Number".
result !== Infinity && result !== -Infinity → avoid infinite values (like dividing by zero).*/

        // Limit precision to avoid scientific notation
        let strResult = result.toString();
        //Converts the numeric result into a string so we can count characters and process formatting.
// Example: 1234.567 → "1234.567".

        // If it's too long, trim & remove trailing decimal zeros
        if (strResult.replace(".", "").replace("-", "").length > 16) {
            /*Checks the total digits in the string (excluding decimal point "." and minus sign "-") — if more than 16, we need to trim it.
            Example: "123,456,789,012,345,678" has more than 16 digits.*/
            strResult = parseFloat(result.toPrecision(16)).toString();
            /*result.toPrecision(16) → rounds the number to 16 significant digits (this avoids long decimals and scientific notation).
    parseFloat(...) → removes unnecessary trailing zeros after the decimal.
   .toString() → convert it back to string for display.
     Example: 123456789.123456789 → "123456789.1234568" (trimmed).*/
        }//End of the if that checks length > 16.

        currentInput = strResult;//Stores the final (possibly trimmed) string into currentInput, which is what will be shown in the calculator display.
    } else {
        currentInput = "Error";//If the number was invalid (NaN or Infinity), set the display to "Error".
    }
    // Save for chaining
    firstOperand = parseFloat(currentInput);/*parseFloat(currentInput)
     Converts the string in currentInput (which might have been typed by the user or calculated as a result) into a floating-point number
      (a real number that can have decimals).
     Example:"123.45" → 123.45 (number)
     "005" → 5 (number)
     This is important because calculations need numbers, not strings.
     firstOperand = ...
     Stores that number into the variable firstOperand, which the calculator uses as the starting number in the next operation.
     For example, in 5 + 6, after you press +, firstOperand becomes 5.*/

    // Reset operator so we can enter a new one
    operator = null;//Clears the operator because the calculation is done. The next operator press will start a new operation.
    // No longer waiting for second operand
    waitingForSecondOperand = false;//Sets the flag to false because the second number was already entered and used in the calculation.
    // Mark that last button pressed was '='
    lastWasEquals = true;//Sets a flag so the program knows the last button pressed was equals (=). This helps handle repeated = presses.
    updateDisplay(); // Refresh display
    //Calls updateDisplay() to show the updated expression and result on screen.
}

// ======= FUNCTION: Calculate result =======
function calculate() {//Defines the calculate() function — this runs when you press the = button.
    // If '=' is pressed repeatedly without new operator — repeat last calculation
    if (operator === null && lastOperator !== null) {
        performCalculation(parseFloat(currentInput), lastOperand, lastOperator);
        return;
    }
    /*Checks if there is no current operator (operator === null) but we do have a stored last operator (lastOperator !== null).
      This means: You pressed = again without pressing a new operator — so it should repeat the last calculation.
      Calls performCalculation() with:
      First number = the current display number (parseFloat(currentInput))
      Second number = lastOperand (the number from last calculation)
      Operator = lastOperator (the operator from last calculation)
      Then return; stops further code from running. */

    // If operator is not set or waiting for second operand — do nothing
    if (operator === null || waitingForSecondOperand) return;
    /*If:No operator is set (operator === null) OR
The calculator is still waiting for the user to type the second number (waitingForSecondOperand is true)
→ Then don’t calculate anything, just exit the function.*/

    const secondOperand = parseFloat(currentInput); // Get second number
    /*Converts the current input (string) into a number for calculation.
This becomes the second number in the math operation.*/

    // Store this operation for repeat '='
    lastOperator = operator;         // Store current operator
    lastOperand = secondOperand;     // Store second operand
    /*Saves the current operator and current second number so that if the user presses = again, the calculator knows what to repeat.*/

    // Perform the calculation
    performCalculation(firstOperand, secondOperand, operator);
    /*Calls the helper function performCalculation() with:
     firstOperand → first number
     secondOperand → second number
     operator → the operator to use
     This function will do the math, update the display, and handle chaining. */
}

// ======= FUNCTION: Clear entry (CE) =======
function clearEntry() {//Declares the function clearEntry() — this runs when the CE button is pressed on your calculator.
    currentInput = "0"; // Reset only the current number
    /*Sets currentInput back to "0".
       This means: only the number currently being typed gets cleared.
       It does not clear:
       firstOperand
       operator
       any previous calculation setup
       Example:If you typed 5 + 42 and then press CE, it becomes 5 + 0. */
    updateDisplay();    // Refresh display
    /*Calls the updateDisplay() function to immediately show "0" on the display.
      Without this, the change would happen in memory but not be visible to the user. */
}

// ======= FUNCTION: Clear all (C) =======
function clearAll() {//Ye function C button dabane par chalta hai, poora calculator state reset karta hai.
    currentInput = "0";         // Reset current number
    /*Display me jo current number dikh raha tha use "0" kar deta hai (string hai kyunki screen pe text dikhana hota hai).*/
    firstOperand = null;        // Reset first operand
    /*Pehla number jo store tha (jaise 5 in 5 + …) usse hata deta hai. Ab koi pehla operand nahi bacha.*/
    operator = null;            // Reset operator
    /*Removes any selected operator (+, -, *, /, %).
This means no operation is in progress.*/
    waitingForSecondOperand = false;/*Ensures we’re not in the “waiting for second number” state.
Next numeric input will behave like a fresh start.*/
    expressionText = "";        // Clear expression line
    /*Clears the top dim expression (like 5 + 6 =).The top line becomes empty.*/
    lastWasEquals = false;      // Reset equals flag
    /*Says “the last key pressed was not = anymore.”
This prevents the post-= special behaviors from affecting the next input.*/
    lastOperator = null;        // Reset repeat operator
    /*Clears the stored operator used for repeat = behavior.
After this, pressing = repeatedly won’t repeat the last math automatically.*/
    lastOperand = null;         // Reset repeat operand
    /*Clears the stored second number for repeat = (e.g., the 6 in 5 + 6 =). */
    updateDisplay();            // Refresh display
    /*English: Immediately updates the UI:
               Top dim line → empty
               Bottom bright line → "0"*/
}


// ======= FUNCTION: Backspace (⌫) =======
function backspace() {//This declares the backspace() function — it runs when you press the ⌫ (Backspace) button in your calculator UI or on the keyboard.
    if (currentInput.length > 1) {//Checks if the current number on the display has more than 1 character.Example: "123" → length is 3.
        // Remove last digit
        currentInput = currentInput.slice(0, -1);//If the number has more than 1 character, remove the last character using .slice(0, -1).Example: "123" becomes "12".
    } else {
        // If only one digit left, reset to "0"
        currentInput = "0";//If there’s only one digit left and you press backspace, replace it with "0" instead of leaving it blank.Example: "7" → backspace → "0".
    }//End of the if...else block
    updateDisplay(); // Refresh display
    //Calls updateDisplay() so the screen immediately shows the updated number.Without this, the change would happen internally but not be visible.
}//End of function


// ======= FUNCTION: Toggle sign (±) ======= Just a comment header so readers know this block handles the ± (plus/minus) feature.
function toggleSign() {//Declares a function named toggleSign that flips the sign of the number currently shown.
    if (currentInput !== "0") {//Agar display "0" hai to kuch mat karo. Warna -0 jaisa confusing output aa sakta hai; isliye 0 ko 0 hi rehne dete hain.
        currentInput = (parseFloat(currentInput) * -1).toString(); // Multiply by -1
        /*parseFloat(currentInput) → converts the string in currentInput (e.g., "25.3") to a number (25.3) so we can do math.
          * -1 → multiplies by -1 to flip the sign (e.g., 25.3 → -25.3, -8 → 8).
          .toString() → converts the numeric result back to a string so it can be placed on the screen.
          Example:
          "25" → 25 → 25 * -1 = -25 → "-25"
          "-3.14" → -3.14 → * -1 = 3.14 → "3.14" 
          Edge case: If currentInput is a non-numeric string like "Error", parseFloat("Error") becomes NaN, and NaN.toString() is "NaN", 
          which you don’t want to show. See the safer version below.*/
        updateDisplay();//Refresh the UI so the new (flipped) value appears immediately.
    }// }Close the if and the function.
}

//Safer version (handles “Error”, avoids “-0”) If i want to avoid NaN and hide -0, use this:
// ======= FUNCTION: Toggle sign (±) =======
function toggleSign() {
    const n = parseFloat(currentInput);     // Convert string to number
    if (!Number.isFinite(n)) return;        // If it's not a valid number (e.g., "Error"), do nothing
    const flipped = -n;                     // Multiply by -1 to flip sign
    // Avoid showing "-0" (negative zero) on the display
    currentInput = Object.is(flipped, -0) ? "0" : String(flipped);
    updateDisplay();                         // Refresh the calculator display
}
/*Number.isFinite(n) se confirm karte hain ki valid number hai; warna ignore.
Object.is(flipped, -0) se -0 pakad ke "0" dikha dete hain.*/


// ======= FUNCTION: Reciprocal (1/x) =======
function reciprocal() {//Declares a function named reciprocal()—yeh 1/x (ulta) nikalne ke liye hai.
    const value = parseFloat(currentInput);//Display ka string number me badal diya (e.g., "8" → 8, "3.5" → 3.5).
    currentInput = value === 0 ? "Error" : (1 / value).toString(); // Prevent divide by 0
    //Uses a ternary operator: if value === 0, set display to "Error" (because 1/0 is not defined). Otherwise compute 1/value,
    //  convert it to string, and show it.
    updateDisplay();//Refresh the UI so the new result/error appears.
}//End of reciprocal function
/*Examples
currentInput = "4" → 1/4 = "0.25"
currentInput = "0" → "Error"
currentInput = "-2" → -0.5*/


// ======= FUNCTION: Square (x²) =======
function square() {//Declares square()—yeh x² (number ka square) nikalta hai.
    const value = parseFloat(currentInput);//Parse the string in the display into a number.
    currentInput = (value * value).toString();//Number ko khud se multiply kiya (square), phir string banake display me set kiya.
    updateDisplay();//Refresh the display to show the new squared value.
}//End of square function
/**Examples
"5" → 25
"-3" → 9
"2.5" → 6.25
Note: JavaScript floating points can produce long decimals (e.g., 0.1 * 0.1 = 0.010000000000000002).
 A formatting step can help if you want cleaner output. */


// ======= FUNCTION: Square root (√x) =======
function sqrt() {//Declares sqrt()—yeh square root nikalta hai.
    const value = parseFloat(currentInput);//Converts the current display string to a number (e.g., "16" → 16, "2.25" → 2.25).
    currentInput = value < 0 ? "Error" : Math.sqrt(value).toString(); // Negative ka sqrt error
    //If the number is negative, show "Error" (real calculators don’t return a real square root for negative numbers). 
    // Otherwise use Math.sqrt(value), convert to string, show it.
    updateDisplay();//Refresh the display to show the new square root or error.
}//End of sqrt function
/*Examples
"9" → "3"
"2" → "1.4142135623730951" (long decimal—can be formatted)
"-4" → "Error"*/



// ======= FUNCTION: Highlight button on key press =======
function highlightButton(key) {//Defines a function named highlightButton that takes one argument key — the keyboard key that was pressed.
    // Find button matching the pressed key Comment describing the intent.
    let btn = Array.from(buttons).find(b => b.textContent.trim() === key);
    /*buttons is a NodeList (from document.querySelectorAll("button")). Array.from(buttons) converts that NodeList to a true Array so we can use
    array methods like .find().
   .find(...) iterates over each button element b and tests whether b.textContent.trim() === key.
    b.textContent gives the visible text inside the button (e.g. "7", "+", "×", "CE"). .trim() removes leading/trailing whitespace so
    comparisons are stable.
    If a matching button is found, btn becomes that DOM element; otherwise btn is undefined.*/

    // Map keyboard symbols to calculator symbols
    //Comment describing the next step (handle differences between keyboard characters and button labels).
    const map = { "*": "×", "/": "÷", "-": "−" };
    /*Creates a small object that maps keyboard keys to calculator button labels.
      On keyboard * is typed for multiply but the UI button shows ×.
      Similarly / → ÷, - → − (minus sign may be a different character).*/
    if (!btn && map[key]) {
        /*If we didn't find a button by the direct text match (!btn) and there exists a mapped symbol for this key (map[key] is truthy),
         then attempt to find a button by the mapped label.  Agar direct match nahi mila aur woh key mapping me hai, toh mapped symbol se dobara
          try karenge (jaise * → ×). */
        btn = Array.from(buttons).find(b => b.textContent.trim() === map[key]);
        /*Search again through buttons, but this time compare to the mapped label (map[key]) — 
        e.g., look for a button whose text is "×" when key was "*".*/
    }//End of if

    // If matching button found, add active class temporarily
    if (btn) {//If we successfully found a DOM element (btn) to highlight, proceed.
        btn.classList.add("active-key");//Adds the CSS class "active-key" to the button. 
        // That class in your CSS produces the pressed animation (e.g., transform: scale(0.95) and darker background).
        setTimeout(() => btn.classList.remove("active-key"), 150); // Remove after 150ms
        /*Schedules a function to run after 150 milliseconds that removes the "active-key" class, so the highlight is temporary.
         setTimeout uses an arrow function here. 150ms gives a short, visible press effect.*/
    }//End of the if (btn) block
}//End of the function.


// ======= KEYBOARD EVENT LISTENER =======
document.addEventListener("keydown", (e) => {/*Ye code poore document pe keydown event sunta hai. Jab koi key press ya hold hoti hai,
ye callback chal jaata hai.           e = the event object (contains e.key, e.code, modifier keys, etc.).*/
    if (!isNaN(e.key)) { append(e.key); highlightButton(e.key); } // Number keys
    /*isNaN(e.key) converts e.key to a number and checks if it is NaN. !isNaN(e.key) is true for numeric characters like "0"..."9".
      If true, it calls append(e.key) to add the digit to the current input and highlightButton(e.key) to show the UI press effect.
      Agar e.key ek digit hai (jaise "7"), toh append("7") chalke woh digit display me add karega aur button highlight karega. */
    else if (["+", "-", "*", "/", "%"].includes(e.key)) { setOperator(e.key); highlightButton(e.key); } // Operators
    /*gar + - * / % me se koi key hai, toh woh operator set karega.
Note: Keyboard * or / from different layouts or Shift combos may behave differently; mapping to UI symbols may be needed
 (you already handle that in highlightButton).*/
    else if (e.key === "Enter" || e.key === "=") { calculate(); highlightButton("="); } // Equals
    /*Treats both the Enter key and the equals key as =: runs the calculate() function and highlights the = button.*/
    else if (e.key === ".") { append("."); highlightButton("."); } // Decimal
    //cimal point add karega. Note: some locales use , as decimal separator — not handled here.
    else if (e.key.toLowerCase() === "c") { clearAll(); highlightButton("C"); } // Clear All
    //If the user presses c or C (case-insensitive), it calls clearAll() and highlights the C button.
    else if (e.key.toLowerCase() === "e") { clearEntry(); highlightButton("CE"); } // Clear Entry
    //e or E acts as CE (clear entry). Calls clearEntry() and highlights the CE button.
    else if (e.key === "Backspace") { backspace(); highlightButton("⌫"); } // Backspace
    //Backspace deletes the last digit; backspace() is called and the backspace UI is highlighted.
    else if (e.key.toLowerCase() === "r") { reciprocal(); highlightButton("1/x"); } // Reciprocal
    else if (e.key.toLowerCase() === "s") { square(); highlightButton("x²"); } // Square
    else if (e.key.toLowerCase() === "q") { sqrt(); highlightButton("²√x"); } // Square root
    else if (e.key.toLowerCase() === "n") { toggleSign(); highlightButton("±"); } // Toggle sign
    /*These map letter keys to scientific functions: r → 1/x, s → x², q → sqrt, n → ±. They call the function and trigger visual highlight.
Shortcut keys for scientific operations. .toLowerCase() is not used here — so only lowercase r/s/q/n will work. I can use e.key.toLowerCase() to 
accept uppercase too. */
});//End of the keydown listener callback.

// ======= INITIAL DISPLAY CALL =======
updateDisplay(); // Set initial "0" on calculator display
//Initializes the UI by calling updateDisplay() so the calculator shows "0" and blank expression when the page loads.