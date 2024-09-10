export const censoredComment = (content: string, offensiveWords: string[]) => {
    return offensiveWords.reduce((censoredContent, word) => {
      return censoredContent.replace(
        new RegExp(word, "gi"),
        "*".repeat(word.length)
      );
    }, content);
  };