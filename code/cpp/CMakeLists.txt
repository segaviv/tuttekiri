cmake_minimum_required(VERSION 3.10)
include(FetchContent)
 
project(kirigami_cpp)
 
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_POLICY_VERSION_MINIMUM 3.22)
 
SET(LIBIGL_RESTRICTED_TRIANGLE ON)
FetchContent_Declare(
    libigl
    GIT_REPOSITORY https://github.com/libigl/libigl.git
    GIT_TAG v2.5.0
)
# Optiz
FetchContent_Declare(
  Optiz
  GIT_REPOSITORY https://github.com/segaviv/optiz.git
  GIT_TAG master
)
 
FetchContent_MakeAvailable(Optiz libigl)
# Eigen3
find_package(Eigen3 QUIET)
if(NOT TARGET Eigen3::Eigen)
  # Eigen not found, fetch it from gitlab.
  FetchContent_Declare(
    Eigen3
    GIT_REPOSITORY https://gitlab.com/libeigen/eigen.git
    GIT_TAG 3.4.0
    SOURCE_SUBDIR cmake # Hack to avoid Eigen's CMakeLists.txt
  )
  FetchContent_MakeAvailable(Eigen3)
  add_library(Eigen3::Eigen INTERFACE IMPORTED)
  set_target_properties(Eigen3::Eigen PROPERTIES INTERFACE_INCLUDE_DIRECTORIES
                                                 ${eigen3_SOURCE_DIR})
endif()
 
file(GLOB SRC_FILES *.cpp utils/*.cpp coloring/*.cpp geometry/*.cpp parameterization/*.cpp opt/*.cpp)
add_executable(${PROJECT_NAME} ${SRC_FILES})
target_link_libraries(${PROJECT_NAME} PUBLIC Eigen3::Eigen Optiz igl::core igl_restricted::triangle)

# To get the intellisense working in VSCode, specify the include dir for emscripten, then configure via the cmake-tools
# extension (and reload window/restart cland server).
target_include_directories(${PROJECT_NAME} PUBLIC /opt/homebrew/Cellar/emscripten/5.0.0/libexec/system/include/)

target_compile_options(${PROJECT_NAME} PRIVATE -Wno-deprecated-declarations)
target_link_options(${PROJECT_NAME} PRIVATE -sMODULARIZE -sEXPORT_NAME="createModule" --bind  -sWASM=1 -sALLOW_MEMORY_GROWTH=1 -sSTACK_SIZE=5MB -sINITIAL_HEAP=50MB  -sNO_EXIT_RUNTIME=0 -sASSERTIONS=2 -sNO_DISABLE_EXCEPTION_CATCHING)

# Export the createModule function for JavaScript. This is needed for the web app to load the WebAssembly module and call its functions.
add_custom_command(TARGET ${PROJECT_NAME}
POST_BUILD
COMMAND echo 'export default createModule;' >> ${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}.js)

# Copy the generated .js and .wasm files to the src directory for use in the web app.
add_custom_command(TARGET ${PROJECT_NAME}
POST_BUILD
COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}.js ${CMAKE_CURRENT_SOURCE_DIR}/../src/)
add_custom_command(TARGET ${PROJECT_NAME}
POST_BUILD
COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}.wasm ${CMAKE_CURRENT_SOURCE_DIR}/../src/)