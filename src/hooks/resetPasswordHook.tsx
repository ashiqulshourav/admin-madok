import { addDialog, closeDialog } from '@/components/ReDialog';
import ResetDialog from '@/components/ResetDialog/index.vue';

export const useResetPasswordHook = () => {
  const resetFormRef = ref();

  const openResetDialog = () => {
    addDialog({
      title: t('重置密码'),
      class: 'reset_dialog',
      width: '25%',
      center: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(ResetDialog, {
          ref: resetFormRef,
          onCloseDialog: (_: boolean) => {
            closeDialog(options, index);
          }
        })
    });
  };

   const copyPassword = (pw: string) => {
    const input = document.createElement('input');
    input.value = pw;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
  const getNewPassword = () => {
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*?'; //()-_+=[]{}|;:,.<>

    // Function to pick a random character from a given string
    const getRandomChar = (characters: string) =>
      characters.charAt(Math.floor(Math.random() * characters.length));

    // Randomly pick one character from each character set
    const randomUppercase = getRandomChar(uppercaseLetters);
    const randomLowercase = getRandomChar(lowercaseLetters);
    const randomNumber = getRandomChar(numbers);
    const randomSymbol = getRandomChar(symbols);

    // Combine all characters into one string
    const allCharacters =
      randomUppercase + randomLowercase + randomNumber + randomSymbol;

    // Shuffle the characters to randomize positions
    const shuffledCharacters = allCharacters
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    // Generate remaining characters randomly
    const remainingLength = 8 - allCharacters.length;
    let password = '';
    for (let i = 0; i < remainingLength; i++) {
      password += getRandomChar(
        uppercaseLetters + lowercaseLetters + numbers + symbols
      );
    }

    // Insert the selected characters at random positions
    const randomPositions = [
      Math.floor(Math.random() * (password.length + 1)),
      Math.floor(Math.random() * (password.length + 1)),
      Math.floor(Math.random() * (password.length + 1))
    ];
    randomPositions.sort((a, b) => a - b);

    password =
      password.slice(0, randomPositions[0]) +
      shuffledCharacters[0] +
      password.slice(randomPositions[0], randomPositions[1]) +
      shuffledCharacters[1] +
      password.slice(randomPositions[1], randomPositions[2]) +
      shuffledCharacters[2] +
      password.slice(randomPositions[2]) +
      shuffledCharacters[3];

    return password;
  };

  return { openResetDialog, getNewPassword, copyPassword };
};
