# Automation test

## Ý tưởng
Sử dụng selenium để làm trình driver. Mocha là test runner.

Ý tưởng thiết kế chính của hệ thống sẽ là tách logic của test domain tách biệt với logic tương tác với ứng dụng.<br>
Các test case sẽ thiên về diễn giải các bussiness logic flow. Chứ không cần phải nặng về các phần tương tác với driver, runer để thực hiện.

## Kiến trúc
```javascript
.
├── constants
│   ├── keywords.js
│   └── settings.js
├── core
│   ├── adapter
│   │   └── slack.js
│   ├── commons
│   │   ├── driver-base-actions.js
│   │   ├── file-actions.js
│   │   ├── hooks.js
│   │   ├── test-case.js
│   │   └── test-runner-base-actions.js
│   ├── factories
│   │   ├── driver.js
│   │   ├── file.js
│   │   └── report.js
│   └── untilities
│       ├── string.js
│       └── time.js
├── object-repository
│   ├── commons
│   │   └── login
│   │       └── login.js
│   └── xpath
│       └── login.js
├── resources
│   ├── data-files
│   │   └── info.json
│   └── test-cases
│       └── demo
│           └── test-case-used-factory.spec.js
└── results
    └── demo
        └── passed-test-case-used-factory.spec.csv
```
### constants
Nơi chứa các khai báo liên quan đến các settings, hằng số không đổi
### core
#### - adapter
Adapter là nới tương tác với các thư viện bên thứ 3, các móc nối đến hệ thống bên ngoài.
#### - factories
Factories là nơi chứa các phương thức được viết sẵn để tương tác với các element trong driver.<br>
Như là: 
+ với driver: gồm có initDriver(), destroyDriver()...
+ với đối tượng là một web thì gồm có: getTilte(), getContent()...
+ ...

### object-repository
Chứa các đối tượng liên quan đến việc mapping id, className, input name trên webpage<br>
Với các đối tượng được định nghĩa ở logic. Như userName, employeeId...

### resources
Nơi chứa test case, các thành phần liên quan như file csv, excel... để nạp vào test case.

### results
Nơi chứa kết quả của việc chạy test. <br>


## Các quy ước khi viết code
Quy ước theo: [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html).

## Cài đặt
### Với Mac + Linux
- Cài nvm (tool quản lý các phiên bản)
- Cài node >= 16.20.0
- Cài các IDE (webstorm, visual studio code)

### Với Window


## Khởi chạy project

Bước 1: Copy .env.example => .env bbằng lệnh copy

`
cp .env.example .env
`

Bước 2: Cài đặt các phụ thuộc

`
yarn install
`
Bước 3 Chạy test case

`
yarn test
`


## Commit

- Trước mỗi commit sẽ chạy một pre-commit prettier format để format trình bày code.
