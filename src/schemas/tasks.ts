export default (): string => `
{
"version": "2.0.0",
  "tasks": [
    {
     "label": "Build C++ project",
      "type": "shell",
     "group": {
        "kind": "build",
        "isDefault": true
      },
     "problemMatcher": "$gcc",
     "command": "g++ -g -Wall -Wextra -Wpedantic -std=c++1z src/*.cpp -o main.exe"
    },
    {
      "label": "Build & run C++ project",
      "type": "shell",
      "group": {
        "kind": "test",
        "isDefault": true
      },
     "problemMatcher": "$gcc",
      "command": "g++ -g -Wall -Wextra -Wpedantic -std=c++1z src/*.cpp -o /bin/main.exe && /bin/main.exe"
    }
 ]
}
`;
