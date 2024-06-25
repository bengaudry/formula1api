import { ExecOptions } from "child_process";
import { exec as natExec } from "child_process";

export function exec(cmd: string, opt: ExecOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    natExec(cmd, opt, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else resolve(stdout ?? stderr);
    });
  });
}
