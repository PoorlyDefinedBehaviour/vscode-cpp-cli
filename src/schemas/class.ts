export default (className: string): any => ({
  header: `#pragma once
#ifndef __${className}__
#define __${className}__

class ${className} {
  public:

  ${className}();
  ~${className}();

  private:
};

#endif
`,
  cpp: `#include "${className}.h"

${className}::${className}(){

}

${className}::~${className}(){
  
}
`
});
