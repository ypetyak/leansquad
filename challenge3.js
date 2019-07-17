// Create a function that finds all possible palindromic partitions of a given string.


function palidromicPartition(string) {

    let palindromes = [];
    // get all palindroms in the string
    for (let i = 0; i < string.length; i++) {
        for (let j = 0; j < string.length - i; j++) {
            let subString = string.substring(j, j + i + 1);
            if (checkPalindrome(subString)) {
                palindromes.push(subString);
            }
        }
    }
    // format all palindroms to display a string per palindrom
    printPalindrome(string, palindromes);
    return;
}

function checkPalindrome(string) {
    let reverseString = string.split('').reverse().join('');
    if (string === reverseString) {
        return true;
    } else {
        return false;
    }
}

function printPalindrome(string, palindromes) {
    let array = [];
    let palindromArray = [];
    for (let i = 0; i < palindromes.length; i++) {
        if (palindromes[i].length === 1) {
            array.push(palindromes[i]);
        }
        if (palindromes[i].length > 1) {
            let singlePal = [];
            let index = string.indexOf(palindromes[i]);
            for (let j = 0; j < string.length; j++) {
                let count = 0;
                if (j < index) {
                    singlePal.push(string.charAt(j));
                }
                if (count === 0 && j === index) {
                    singlePal.push(palindromes[i]);
                    count = 1;
                }
                
                if (j > palindromes[i].length) {
                    singlePal.push(string.charAt(j));
                }
            }
            palindromArray.push(singlePal);
        }
    }
    // print single letter palindroms
    console.log(array.join(' '));
    // print all other palindroms
    for (let el of palindromArray) {
        console.log(el.join(' '));
    }
}

palidromicPartition('nitin');

palidromicPartition('geeks');
