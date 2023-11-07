import "dotenv/config";
import { reportToFile } from "#factories/report.js";

export const mochaHooks = {
  afterEach(done) {
    if (process.env.EXPORT_REPORT === "true") {
      reportToFile(this.currentTest);
    }
    done();
  },
};
