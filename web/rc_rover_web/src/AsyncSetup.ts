export class AsyncSetup
{

    /**
     * Creates an instance of AsyncSetup.
     * @memberof AsyncSetup
     */
    constructor()
    {

    }

    /**
     *
     * contains the awaiter instances of the setup process
     *
     * @private
     * @memberof AsyncSetup
     */
    private _setupAwaiterInstances: (() => void)[] = [];
    /**
     * contains the registered setups
     *
     * @private
     * @type {Promise<any>[]}
     * @memberof AsyncSetup
     */
    private _setups: Promise<any>[] = [];
    /**
     * value indicating if the setup has finished
     *
     * @private
     * @type {boolean}
     * @memberof AsyncSetup
     */
    private _setupFinished: boolean = false;



    /**
     * invokes the setup methods and invokes the waiting methods
     *
     * @private
     * @memberof AsyncSetup
     */
    public executeAsyncSetup()
    {
        Promise.all(this._setups).then(_ =>
        {
            this._setupAwaiterInstances.forEach(awaiterInstance => { awaiterInstance(); });
            this._setupAwaiterInstances = [];
            this._setupFinished = true;
        });

        return this;
    }

    /**
     *registers a new asyncronous setup
     *
     * @protected
     * @param {Promise<any>} setup the SetupPromise
     * @memberof AsyncSetup
     */
    public registerSetup(setup: Promise<any>)
    {
        this._setups.push(setup);
        return this;
    }

    /**
     * method to call when the setup of functions is necesarry
     *
     * @private
     * @returns resolves if the setup has finished
     * @memberof AsyncSetup
     */
    public ensureSetup()
    {
        if (this._setupFinished)
        {
            return Promise.resolve();
        } else
        {
            return new Promise<void>((resolve, reject) =>
            {
                this._setupAwaiterInstances.push(resolve);
            });
        }
    }

    /**
     * indicates if the setup is finished executing
     *
     * @return {boolean} indicating if the setup has finished 
     * @memberof AsyncSetup
     */
    public isSetupFinished()
    {
        return this._setupFinished;
    }


}