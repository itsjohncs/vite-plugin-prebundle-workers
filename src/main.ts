export class WorkerStore {
	private static instance: WorkerStore;
	private workerSources: Record<string, string> = {};
	private _base = "/workers/";

	public get base(): string {
		return this._base;
	}
	public set base(value: string) {
		if (value === this._base) return;
		this._base = value;
		this.workerSources = {};
	}

	constructor(base?: string) {
		if (WorkerStore.instance) return WorkerStore.instance;
		WorkerStore.instance = this;
		this.base = base || this.base;
	}

	async spawn(workerName: string, options: WorkerOptions = { type: "module" }): Promise<Worker> {
		return new Promise(async (resolve, reject) => {
			const workerSource = await this.getWorkerSource(workerName).catch(reject);
			if (!workerSource) return;
			const worker = new Worker(workerSource, options);
			resolve(worker);
		});
	}

	private async getWorkerSource(workerName: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			if (this.workerSources[workerName]) return resolve(this.workerSources[workerName]);
			const source = await fetch(`${this.base}${workerName}.worker.js`).catch(reject);
			if (!source) return;
			const url = URL.createObjectURL(new Blob([await source.text()], { type: "application/javascript" }));
			this.workerSources[workerName] = url;
			resolve(url);
		});
	}
}
