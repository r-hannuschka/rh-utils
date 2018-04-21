export class Helper 
{
    /**
     * generates an id
     * 
     * @static
     * @returns {string} 
     * @memberof Helper
     */
    public static generateId(): string
    {
        return Math.random().toString(32).substr(2);
    }
}
