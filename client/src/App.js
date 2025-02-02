import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {fetchProgress, updateConfig, upload} from "./store";
import {useState} from "react";

function resolveProgressPerc(item) {
  if (item === "read") { return "10%" }
  if (item === "initialized") { return "30%" }
  if (item === "onnx") { return "50%" }
  if (item === "openvino") { return "65%" }
  if (item === "blob") { return "80%" }
  if (item === "json") { return "99%" }
  if (item === "zip") { return "100%" }

  return "0%"
}

function resolveProgressString(item) {
  if (item === "new") { return "Data received." }
  if (item === "read") { return "Initializing..." }
  if (item === "initialized") { return "Converting to ONNX..." }
  if (item === "onnx") { return "Converting to OpenVINO..." }
  if (item === "openvino") { return "Converting to MyriadX blob..." }
  if (item === "blob") { return "Exporting JSON config..." }
  if (item === "json") { return "Preparing zip file..." }
  if (item === "zip") { return "Conversion complete." }

  return ""
}

function App() {
  const [file, setFile] = useState('')
  const [advanced, setAdvanced] = useState(false);
  const config = useSelector((state) => state.app.config)
  const error = useSelector((state) => state.app.error)
  const inProgress = useSelector((state) => state.app.inProgress)
  const progress = useSelector((state) => state.app.progress)
  const progressPerc = resolveProgressPerc(progress)
  const progressString = resolveProgressString(progress)
  const dispatch = useDispatch()


  const update = data => dispatch(updateConfig(data))

  return (
    <section className="h-100 gradient-form" style={{backgroundColor: "#eee"}}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black mb-3">
              <div className="row g-0">
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mcustomizablex-md-4">
                    <h4 className="mb-4">Automatic Yolo export for OAKs</h4>
                    <p className="small mb-2">With the goal of simplifying the export process of the most popular object
                      detectors, we developed this tool. Simply upload the weights of the pre-trained model (.pt file), and we'll
                      compile a blob and JSON configuration for you.</p>
                    <p className="small mb-2">Run your object detector on our devices by using the compiled blob and
                      generated JSON file at</p>
                    <p className="large mb-2"><a href="https://tinyurl.com/oak-d-yolo">DepthAI Experiments!</a></p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4 config-col">

                    <div className="text-center">
                      <img src="https://docs.luxonis.com/en/latest/_static/logo.png" style={{width: 185}} alt="logo"/>
                      <h4 className="mt-1 pb-1">Upload your model</h4>
                    </div>

                    {
                      error && <div className="error-box">
                        <h3>An error occurred</h3>
                        <p>{error.message}</p>
                        <span>Please try again or reach out to <a href="mailto:support@luxonis.com" target="_blank">support@luxonis.com</a></span>
                      </div>
                    }

                    <form onSubmit={e => {
                      e.preventDefault();
                      dispatch(upload(file));
                      dispatch(fetchProgress());
                    }}>
                      <div className="mb-3 mt-5">
                        <label htmlFor="version">Yolo Version</label>
                        <select id="version" value={config.version} name="version" className="form-select" aria-label="Default select example"
                                onChange={e => update({version: e.target.value})}>
                          <option value="v5">YoloV5</option>
                          <option value="v6r2">YoloV6 (R2, R3)</option>
                          <option value="v7">YoloV7 (detection only)</option>
                          <option value="v8">YoloV8 (detection only)</option>
                          <option value="v6">YoloV6 (R1)</option>
                        </select>
                        <p class="small mt-1">
                          Have trouble picking the right version? See <a href="https://docs.google.com/spreadsheets/d/16k3P-LxPMFREoePLvoLqDZo0Xu_tRcSpm_BjQE3PHQY/edit?usp=sharing" target="_blank">here</a> for the version overview.
                        </p>
                      </div>
                      <div className="mb-3" data-bs-toggle="tooltip" data-bs-placement="left" title="Weights of a pre-trained model (.pt file), size needs to be smaller than 100Mb.">
                        <label htmlFor="file" className="form-label">File <i class="bi bi-info-circle-fill"></i></label>
                        <input className="form-control" type="file" id="file" name="file" onChange={e => setFile(e.target.files[0])}/>
                      </div>
                      <div className="mb-3" data-bs-toggle="tooltip" data-bs-placement="left" title="Integer for square input image shape, or width and height separated by space. Must be divisible by 32 (or 64 depending on the stride)">
                        <label htmlFor="inputshape" className="form-label">Input image shape <i class="bi bi-info-circle-fill"></i></label>
                        <input className="form-control" type="int" id="inputshape" name="inputshape" value={config.inputshape} onChange={e => update({inputshape: e.target.value})}/>
                      </div>
                      <div data-bs-toggle="tooltip" data-bs-placement="left" title="Number of shaves (default is 6)" onClick={() => setAdvanced(!advanced)}>
                        <label className="form-label active">Advanced options { advanced ? <i class="bi bi-caret-up-fill"></i> : <i class="bi bi-caret-down-fill"></i> } </label>
                      </div>
                      <div className="mb-3">
                        <div className={`advanced-option ${advanced ? 'expanded' : ''}`}>
                          <div className="display-column">
                            <label htmlFor="nShaves" className="form-label"><a className="form-label-link" href="https://docs.luxonis.com/en/latest/pages/faq/#what-are-the-shaves" target="_blank">Shaves:</a> {config.nShaves}</label>
                            <input type="range" id="nShaves" name="nShaves" min={1} max={16} onChange={e => update({nShaves: e.target.value})} value={config.nShaves}/>
                            <div className="shaves-ticks">
                              <span>1</span>
                              <span>16</span>
                            </div>
                          </div>
                          <div data-bs-toggle="tooltip" data-bs-placement="left" title="If off, defaults to OpenVINO 2022.1. Slight performance degradation noticed with 2022.1.">
                            <label htmlFor="useLegacyFrontend" className="form-label mr10">Use OpenVINO 2021.4: <i class="bi bi-info-circle-fill"></i></label>
                            <input type="checkbox" id="useLegacyFrontend" name="useLegacyFrontend" onChange={e => update({useLegacyFrontend: !config.useLegacyFrontend})} checked={config.useLegacyFrontend}/>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mb-3 d-grid">
                        {
                          inProgress
                            ? <button type="button" className="btn btn-primary disabled fa-lg gradient-custom-2">Submit</button>
                            : <button type="submit" className="btn btn-primary fa-lg gradient-custom-2">Submit</button>
                        }
                      </div>
                    </form>
                    {
                      inProgress && <span>{progressString}</span>
                    }
                    <div className="progress">
                      <div id="progress-active" className="progress-bar progress-bar-striped progress-bar-animated"
                           role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                           style={{width: inProgress ? progressPerc : 0}}/>
                    </div>
                    {
                      inProgress && <span className="progress-prompt">This might take a few minutes.</span>
                    }
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <p class="small text-center mb-0">
                  Curious how I work or need to host me on premisses? <a href="https://github.com/luxonis/tools">Check me out on <i class="bi bi-github"></i></a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
