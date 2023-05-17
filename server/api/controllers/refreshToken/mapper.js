export const toToken = (Token) => {
    return {
        userId: Token.userId,
        token: Token.token,
        createdAt: Token.createdAt,
    }
}