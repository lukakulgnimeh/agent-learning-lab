# LangGraph Environment Setup — Reproducibility Notes
 
Target: Windows 11, VS Code, local Python environment via conda, no LangGraph Platform/Studio/LangSmith required.
 
## 1. Install VS Code extensions
 
Extensions panel (`Ctrl+Shift+X`) → install:
- **Python** (Microsoft)
- **Jupyter** (Microsoft)
Both pull in several sub-extensions automatically (Pylance, Jupyter Keymap, Jupyter Cell Tags, etc.) — expected, not an error.
 
## 2. Install Miniconda (not the full Anaconda Distribution)
 
Download from anaconda.com/download, selecting the **Miniconda** tab (or directly from repo.anaconda.com/miniconda/). Run the installer with default options. This gives the `conda` command and a base Python without Anaconda Navigator or the ~600 bundled data-science packages, which aren't needed here.
 
## 3. Create and activate a dedicated environment
 
Open **"Anaconda Prompt (miniconda3)"** from the Start menu (not a plain PowerShell window — this one has `conda` on PATH already):
 
```
conda create -n weather-langgraph python=3.12
conda activate weather-langgraph
```
 
## 4. Install required packages
 
```
pip install langgraph langchain langchain-anthropic jupyter python-dotenv ipykernel
```
 
`ipykernel` is listed explicitly and separately from `jupyter` because it's needed later (step 8) to manually register the environment as a selectable notebook kernel — VS Code's automatic kernel discovery is not fully reliable for conda environments at the time of writing.
 
Sanity check: `pip show langgraph` should print a version, not an error.
 
## 5. Create the project folder structure
 
Inside your project's `weather-multi-agent/` subfolder:
 
```
weather-multi-agent/
├── data/
│   └── wardrobe.md      # copy of Part A's data/wardrobe.md
├── .env                  # API key — see step 6
├── .gitignore            # see step 6
└── hello.ipynb           # first verification notebook
```
 
## 6. Store the API key and exclude it from git
 
Create `.env` inside `weather-multi-agent/`:
 
```
ANTHROPIC_API_KEY=sk-ant-your-real-key-here
```
 
Create (or extend) `.gitignore` in the same folder:
 
```
.env
.vscode/
```
 
(`.vscode/` is included because VS Code's newer environment-discovery tooling writes machine-specific settings there — see the troubleshooting note below.)
 
## 7. Open the project and select the interpreter
 
File → Open Folder → your project root (the folder containing `weather-multi-agent/`, so it's visible alongside the other parts of the comparison project).
 
`Ctrl+Shift+P` → **"Python: Select Interpreter"** → choose the one under `...\miniconda3\envs\weather-langgraph\python.exe`.
 
If it isn't listed: `Ctrl+Shift+P` → **"Developer: Reload Window"** — VS Code caches the environment list at startup and won't see an environment created after it was already open.
 
## 8. Register the notebook kernel explicitly
 
Do this even if step 7 succeeded — it avoids a separate, independent kernel-discovery step that can fail on its own:
 
```
conda activate weather-langgraph
python -m ipykernel install --user --name weather-langgraph --display-name "Python (weather-langgraph)"
```
 
## 9. Open the notebook and select the kernel
 
Open `hello.ipynb` → click the kernel picker (top-right) → **"Python Environments..."** (not "Existing Jupyter Server", which expects an `http://` URL to an already-running server and is the wrong option here) → select **"Python (weather-langgraph)"**.
 
## 10. Verify the full chain with one test cell
 
```python
from dotenv import load_dotenv
load_dotenv(override=True)  # override=True: see troubleshooting note below
 
from langchain_anthropic import ChatAnthropic
import os
 
val = os.environ.get("ANTHROPIC_API_KEY")
print("present:", val is not None, "| starts with:", (val or "")[:11])
 
llm = ChatAnthropic(model="claude-sonnet-5")
response = llm.invoke("Say hello in one short sentence.")
print(response.content)
```
 
Expected output: `present: True | starts with: sk-ant-...` followed by a one-sentence greeting. If both appear, the environment, kernel, and API connectivity are all confirmed working.
 
## Troubleshooting notes (issues actually hit during setup)
 
- **`"No Python environment is set for this resource"` in the logs, plus a `.vscode/settings.json` with `python-envs.defaultEnvManager`:** harmless. VS Code's newer, still-experimental "Python Environments" extension (`ms-python.vscode-python-envs`) logs this while it resolves the environment; it does not block anything once the correct interpreter/kernel is actually selected (steps 7–9).
- **Kernel picker only offers "Python Environments..." and "Existing Jupyter Server...":** always choose the former for a local conda environment; the latter is for connecting to an already-running server via URL.
- **Info message about `python.terminal.useEnvFile` when saving `.env`:** refers only to VS Code's integrated terminal and debug-launch environment injection, not to `load_dotenv()` inside a notebook. Safe to ignore for this workflow.
- **`load_dotenv()` appears to run, `ANTHROPIC_API_KEY` is `present: True`, but authentication still fails:** `load_dotenv()` does not overwrite a variable that's already set in the environment — including an empty string. If `ANTHROPIC_API_KEY` was ever set at the OS level and left blank (e.g. while configuring a different tool's CLI authentication), it silently shadows `.env`. Fix: `load_dotenv(override=True)`, and clean up the stray OS-level variable via System Properties → Environment Variables for a permanent fix.