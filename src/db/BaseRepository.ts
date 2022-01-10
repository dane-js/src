module.exports = class BaseRepository
{
    protected db : {[key: string]: _db.BaseModel} = {};
    protected model : any = {};


    protected repoName : string | null = null;

    setRepoName(repoName: string) : this {
      this.repoName = repoName;

      return this
    }
    getRepoName() : string | null { 
      return this.repoName; 
    }


    constructor(db : {[key: string]: _db.BaseModel}) {
        this.db = db;
    }

    initializeModel() : this {
        const name : string | null = this.getRepoName();
        if (name != null && this.db[name]) {
            this.model = this.db[name];
        }

        return this;
    }

    /**
     * Verifie si un element existe deja en base de données
     * 
     * @param {object} where 
     * @return {boolean} 
     */
    async exists(where: {[key: string]: any}) : Promise<boolean> {
        return await this.model.count({where}) > 0;
    }
}