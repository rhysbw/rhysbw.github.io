const outputElement = document.getElementById("output");
const inputElement = document.getElementById("input");

let currentDirectory = "~";

// Virtual file system data structure
const fileSystem = {
    "~": {
        type: "directory",
        contents: {
            "Skills": {
                type: "directory",
                contents: {
                    "Programming_Languages.txt": {
                        type: "file",
                        content: "Proficient in Python, Java, C, Haskell, HTML.",
                    },
                    "Cybersecurity.txt": {
                        type: "file",
                        content: "Hands-on experience in penetration testing, ethical hacking, and CTF challenges on platforms like HackTheBox.",
                    },
                    "Automation.txt": {
                        type: "file",
                        content: "Skilled in using Ansible for infrastructure automation.",
                    },
                    "Scripting.txt": {
                        type: "file",
                        content: "Proficient in shell scripting for automation and home automation scripts.",
                    },
                    "Software_Development.txt": {
                        type: "file",
                        content: "Actively involved in Django web development projects.",
                    },
                    "AWS.txt": {
                        type: "file",
                        content: "Familiar with Amazon Web Services (AWS) for cloud computing.",
                    },
                    "Linux_Administration_CLI.txt": {
                        type: "file",
                        content: "Experienced in Linux system administration and command-line operations.",
                    },
                    "Agile_Methodology.txt": {
                        type: "file",
                        content: "Experienced in Agile development, including daily stand-ups, sprint planning, and iterative project delivery.",
                    },
                    "Version_Control.txt": {
                        type: "file",
                        content: "Practiced in Git best practices for maintaining a well-structured and organized codebase.",
                    },
                    "Project_Management.txt": {
                        type: "file",
                        content: "Proficient in using Jira for tracking and managing project tickets.",
                    },
                },
            },
            "Work_Experience": {
                type: "directory",
                contents: {
                    "Immersive_Labs.txt": {
                        type: "file",
                        content: "Role: Cyber Range Developer (Internship)\n\n" +
                            "Collaborated in a team of 8 as part of a professional internship program, working on cyber range development for training purposes.\n" +
                            "Utilized Agile methodology to plan, develop, and deliver cyber ranges efficiently, ensuring alignment with project goals and timelines.\n" +
                            "Employed Git version control best practices, including branching, merging, and code reviews, to maintain a well-structured and organized codebase.",
                    },
                    "Cyber_Academy.txt": {
                        type: "file",
                        content: "Role: Student\n\n" +
                            "Participated in a Cyber academy, where I dedicated full-time hours to deepen my knowledge of cybersecurity.\n" +
                            "Collaborated with peers on an Internet of Things Hackathon, successfully gaining control of an IP camera, showcasing practical skills in ethical hacking.",
                    },
                },
            },
            "Education": {
                type: "directory",
                contents: {
                    "Bachelor_of_Science_in_Computer_Science.txt": {
                        type: "file",
                        content: "Bachelor of Science (BSc) in Computer Science\n" +
                            "University of Exeter | Expected Graduation: 2024",
                    },
                    "A_Level.txt": {
                        type: "file",
                        content: "A Level:\n" +
                            "- Computer Science - A*\n" +
                            "- Mathematics - A*\n" +
                            "- Physics - A\n" +
                            "- Welsh Baccalaureate - A",
                    },
                    "GCSE.txt": {
                        type: "file",
                        content: "13 GCSEs from A* to B, including English, Maths, Welsh First Language",
                    },
                },
            },
        },
    },
};


inputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const command = inputElement.value.trim();
        inputElement.value = "";

        // Execute the command
        executeCommand(command);
    }
});

function executeCommand(command) {
    if (command === "help") {
        output("Available commands:\n- ls\n- cd [directory]\n- cat [file]\n- touch [file]");
    } else if (command === "ls") {
        listFiles();
    } else if (command.startsWith("cd")) {
        const targetDirectory = command.split(" ")[1];
        if (targetDirectory) {
            changeDirectory(targetDirectory);
        } else {
            output("Usage: cd [directory]");
        }
    } else if (command.startsWith("cat")) {
        const fileName = command.split(" ")[1];
        if (fileName) {
            catFile(fileName);
        } else {
            output("Usage: cat [file]");
        }
    } else if (command.startsWith("touch")) {
        const fileName = command.split(" ")[1];
        if (fileName) {
            createFile(fileName);
        } else {
            output("Usage: touch [file]");
        }
    } else if(command === "clear") {
        clearTerminal();
    } else {
        output(`Command not found: ${command}`);
    }
}

function listFiles() {
    if (currentDirectory === "~") {
        const contents = Object.keys(fileSystem[currentDirectory].contents).join("\n");
        output(`Contents of ${currentDirectory}:\n${contents}`);
        return;
    }

    const currentPathComponents = currentDirectory.split("/");
    const currentDirName = currentPathComponents.pop(); // Get the current directory name
    const parentDirPath = currentPathComponents.join("/"); // Get the path of the parent directory

    if (!fileSystem[parentDirPath] || !fileSystem[parentDirPath].contents[currentDirName] || fileSystem[parentDirPath].contents[currentDirName].type !== "directory") {
        output(`Directory not found: ${currentDirectory}`);
        return;
    }

    const contents = Object.keys(fileSystem[parentDirPath].contents[currentDirName].contents).join("\n");
    output(`Contents of ${currentDirectory}:\n${contents}`);
}


function clearTerminal(){
    outputElement.innerHTML = "";
}

function changeDirectory(targetDirectory) {
    if (targetDirectory === "..") {
        // Handle navigating up one level
        const pathComponents = currentDirectory.split("/");
        pathComponents.pop(); // Remove the last component to go up one level
        const newPath = pathComponents.join("/") || "~"; // If newPath is empty, set it to "~"
        currentDirectory = newPath;
        output(`Changed directory to: ${currentDirectory}`);
        return;
    }

    const pathComponents = targetDirectory.split("/");
    let currentDir = "~";

    for (const component of pathComponents) {
        if (currentDir === "~") {
            if (fileSystem[currentDir].contents[component] && fileSystem[currentDir].contents[component].type === "directory") {
                currentDir = `${currentDir}/${component}`; // Update currentDir with the absolute path
            } else {
                output(`Directory not found: ${targetDirectory}`);
                return;
            }
        } else if (fileSystem[currentDir].type === "directory" && fileSystem[currentDir].contents[component] && fileSystem[currentDir].contents[component].type === "directory") {
            currentDir = `${currentDir}/${component}`; // Update currentDir with the absolute path
        } else {
            output(`Directory not found: ${targetDirectory}`);
            return;
        }
    }

    currentDirectory = currentDir; // Update the current directory
    output(`Changed directory to: ${currentDirectory}`);
}



function catFile(fileName) {
    if (currentDirectory === "~") {
        // Handle the root directory (~)
        const file = fileSystem[currentDirectory].contents[fileName];
        if (file && file.type === "file") {
            output(`Contents of ${fileName}:\n${file.content}`);
        } else {
            output(`File not found: ${fileName}`);
        }
        return;
    }

    const currentPathComponents = currentDirectory.split("/");
    const currentDirName = currentPathComponents.pop(); // Get the current directory name
    const parentDirPath = currentPathComponents.join("/"); // Get the path of the parent directory

    if (!fileSystem[parentDirPath] || !fileSystem[parentDirPath].contents[currentDirName] || fileSystem[parentDirPath].contents[currentDirName].type !== "directory") {
        output(`Directory not found: ${currentDirectory}`);
        return;
    }

    const file = fileSystem[parentDirPath].contents[currentDirName].contents[fileName];
    if (file && file.type === "file") {
        output(`Contents of ${fileName} in ${currentDirectory}:\n${file.content}`);
    } else {
        output(`File not found: ${fileName}`);
    }
}




/*
function createDirectory(directoryName) {
    if (currentDirectory === "~") {
        // Handle creating directories in the root directory (~)
        const path = `${currentDirectory}/${directoryName}`;
        if (!fileSystem[currentDirectory].contents[directoryName]) {
            fileSystem[currentDirectory].contents[directoryName] = { type: "directory", contents: {} };
            output(`Created directory: ${path}`);
        } else {
            output(`Directory already exists: ${path}`);
        }
        return;
    }

    const currentPathComponents = currentDirectory.split("/");
    const currentDirName = currentPathComponents.pop(); // Get the current directory name
    const parentDirPath = currentPathComponents.join("/"); // Get the path of the parent directory

    if (!fileSystem[parentDirPath] || !fileSystem[parentDirPath].contents[currentDirName] || fileSystem[parentDirPath].contents[currentDirName].type !== "directory") {
        output(`Directory not found: ${currentDirectory}`);
        return;
    }

    const path = `${currentDirectory}/${directoryName}`;
    if (!fileSystem[parentDirPath].contents[currentDirName].contents[directoryName]) {
        fileSystem[parentDirPath].contents[currentDirName].contents[directoryName] = { type: "directory", contents: {} };
        output(`Created directory: ${path}`);
    } else {
        output(`Directory already exists: ${path}`);
    }
}
*/

function createFile(fileName) {
    if (currentDirectory === "~") {
        // Handle creating files in the root directory (~)
        const path = `${currentDirectory}/${fileName}`;
        if (!fileSystem[currentDirectory].contents[fileName]) {
            fileSystem[currentDirectory].contents[fileName] = { type: "file", content: "" };
            output(`Created file: ${path}`);
        } else {
            output(`File already exists: ${path}`);
        }
        return;
    }

    const currentPathComponents = currentDirectory.split("/");
    const currentDirName = currentPathComponents.pop(); // Get the current directory name
    const parentDirPath = currentPathComponents.join("/"); // Get the path of the parent directory

    if (!fileSystem[parentDirPath] || !fileSystem[parentDirPath].contents[currentDirName] || fileSystem[parentDirPath].contents[currentDirName].type !== "directory") {
        output(`Directory not found: ${currentDirectory}`);
        return;
    }

    const path = `${currentDirectory}/${fileName}`;
    if (!fileSystem[parentDirPath].contents[currentDirName].contents[fileName]) {
        fileSystem[parentDirPath].contents[currentDirName].contents[fileName] = { type: "file", content: "" };
        output(`Created file: ${path}`);
    } else {
        output(`File already exists: ${path}`);
    }
}





function output(text) {
    outputElement.textContent += `\n${text}`;
    outputElement.scrollTop = outputElement.scrollHeight;
}
