 function isUpper(character) {
  return (character === character.toUpperCase()) && (character !== character.toLowerCase());
}

function isPalindrome(word)
{
  for(var i=0; i < word.length;i++ ){
    var ans =isUpper(word[i]); 
    if( ans) return true;

  }
  return false;
    
} 