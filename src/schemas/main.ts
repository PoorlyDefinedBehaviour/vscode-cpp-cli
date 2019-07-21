export default (): string => `\
#include <iostream>

auto print = [](auto &&... args) -> void {
  (std::cout << ... << args) << '\\n';
};
    
auto main() -> int {
  print("Hello world");
}
`;
