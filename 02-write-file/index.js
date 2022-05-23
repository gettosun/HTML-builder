const fs = require('fs');
const path = require ('path');
const { stdin, stdout} = process;
const filePath = path.join(__dirname, 'text.txt')

stdout.write('Type some text:\n');

stdin.on('data', data => {
  if(data.toString().trim() == 'exit') {
    goodBye();
  } else {
    fs.appendFile(filePath, data.toString(), function(error) {
      if(error) throw error;
    });
  }
});

process.on('SIGINT', () => {
  goodBye();
});

function goodBye() {
  stdout.write('Good bye');
  process.exit();
}