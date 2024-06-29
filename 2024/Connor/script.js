document.addEventListener('DOMContentLoaded', function() {
  const scene = document.getElementById('scene');
  const character = document.getElementById('character');
  const gridWidth = 20;
  const gridHeight = 15;
  let characterTop = window.innerHeight / 2;
  let characterLeft = window.innerWidth / 2;
  let isDragging = false;
  let initialMouseX, initialMouseY, initialWidth, initialHeight;

  // Function to create and position green dots
  function createGreenDots() {
    for (let i = 0; i < 10; i++) {
      const dot = document.createElement('div');
      dot.classList.add('green-dot');
      dot.style.top = Math.random() * 100 + 'vh';
      dot.style.left = Math.random() * 100 + 'vw';
      document.body.appendChild(dot);
     }
   }


   // Function to create and position trees around the entire page
   function createTrees() {
     for (let i = 0; i < 10; i++) {
       const tree = document.createElement('div');
       tree.classList.add('tree');
       tree.style.top = Math.random() * 100 + 'vh';
       tree.style.left = Math.random() * 100 + 'vw';
       document.body.appendChild(tree);
     }
   }


   // Initial terrain generation
   createGreenDots(50);
   createTrees(10);


  document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    switch (key) {
      case 'arrowup':
        moveCharacter('up');
        break;
      case 'arrowdown':
        moveCharacter('down');
        break;
      case 'arrowleft':
        moveCharacter('left');
        break;
      case 'arrowright':
        moveCharacter('right');
        break;
      default:
        break;
    }
  });

  character.addEventListener('mousedown', function(event) {
    isDragging = true;
    initialMouseX = event.clientX;
    initialMouseY = event.clientY;
    initialWidth = character.clientWidth;
    initialHeight = character.clientHeight;
    document.body.style.userSelect = 'none'; // Prevent text selection while dragging
  });

  document.addEventListener('mousemove', function(event) {
    if (isDragging) {
      const deltaX = event.clientX - initialMouseX;
      const deltaY = event.clientY - initialMouseY;
      character.style.width = initialWidth + deltaX + 'px';
      character.style.height = initialHeight + deltaY + 'px';
    }
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = ''; // Re-enable text selection
    }
  });

   function moveCharacter(direction) {
    const moveAmount = 20; // Adjust based on grid size and character size
    switch (direction) {
      case 'up':
        characterTop -= moveAmount;
        character.classList.remove('move-down', 'move-left', 'move-right');
        character.classList.add('move-up');
        break;
      case 'down':
        characterTop += moveAmount;
        character.classList.remove('move-up', 'move-left', 'move-right');
        character.classList.add('move-down');
        break;
      case 'left':
        characterLeft -= moveAmount;
        character.classList.remove('move-up', 'move-down', 'move-right');
        character.classList.add('move-left');
        break;
      case 'right':
        characterLeft += moveAmount;
        character.classList.remove('move-up', 'move-down', 'move-left');
        character.classList.add('move-right');
        break;
      default:
        break;
    }

   // Update character position
    character.style.top = characterTop + 'px';
    character.style.left = characterLeft + 'px';

   // Check if character is near the edge of the viewport
    if (characterTop < moveAmount || characterTop > window.innerHeight - moveAmount ||
        characterLeft < moveAmount || characterLeft > window.innerWidth - moveAmount) {
      generateNewTerrain();
    }
  }

  // Center the character at the start
  character.stlye.top = characterTop + 'px';
  character.style.left = characterLeft + 'px';
});
