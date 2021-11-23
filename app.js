const textArea = document.getElementById('text');
const id = document.getElementById('id');
const select = document.getElementById('select');
const form = document.getElementById('form');
let newData = data;


function showData() {
  console.clear();
  console.log(newData)
  // console.log(JSON.prune(newData))
}

function uniqueData() {
  let regions = new Set(),
      branches = new Set(),
      subjects = new Set(),
      educationalPrograms = new Set(),
      specialties = new Set(),
      offerTypes = new Set();

  newData.forEach(university => {
    university.specialties.forEach(specialty => {
      specialty.subjects.forEach(subject => {
        subjects.add(subject.subject)
      })

      branches.add(specialty.branch)
      educationalPrograms.add(specialty.educationalProgram)
      specialties.add(specialty.specialty)
      offerTypes.add(specialty.offerType)
    })

    regions.add(university.region)
  })

  console.log(
      regions,
      branches,
      subjects,
      educationalPrograms,
      specialties,
      offerTypes
  )
}

function onInputRange(element) {
  document.getElementById(element.id + '-span').innerText = element.value
}

//get all props
function GAL(arr, formData, prop, l, pr) {
  if (formData.get(prop))// && formData.get('pr-' + prop) > 4)
    arr.push({
      name: prop,
      value: formData.get(prop),
      layer: l,
      priority: formData.get(pr ? pr : 'pr-' + prop)
    })
}

function filterFunction(fd, id, value, pr) {
  let res = fd

  if (id === 'region')
    res = fd.filter(university => university.region === value)

  if (id === 'education-form')
    res = fd.filter(university =>
        university.specialties.some(spec => spec.form === value)
    )

  if (id === 'branch')
    res = fd.filter(university =>
        university.specialties.some(spec => spec.branch === value)
    )
  if (id === 'educational-program')
    res = fd.filter(university =>
        university.specialties.some(spec => (spec.educationalProgram)? spec.educationalProgram.search(value) > -1 : false)
    )

  if (id === 'offer-type')
    res = fd.filter(university =>
        university.specialties.some(spec => (spec.offerType)? spec.offerType.search(value) > -1 : false)
    )

  if (id === 'specialty')
    res = fd.filter(university =>
        university.specialties.some(spec => spec.specialty === value)
    )

  if (id === 'technical-or-humanitarian')
    res = fd.filter(university =>
        university.specialties.some(spec => {
          if (value === 'Технічні науки')
            return (+spec.specialty.slice(0, 3) > 100 && +spec.specialty.slice(0, 3) < 200)
          else
            return (+spec.specialty.slice(0, 3) < 100 || +spec.specialty.slice(0, 3) > 200)
        })
    )

  if (id === 'subject1' ||
      id === 'subject2' ||
      id === 'subject3')
    res = fd.filter(university =>
        university.specialties.some(spec =>
            spec.subjects.some(sub => sub.subject.search(value) > -1 && +sub.k > 0)//=== value && +sub.k > 0)
        )
    )

  return (res.length || pr > 4) ? res : fd;
}

function handleSubmitForm() {
  let result,
      prioritiesArray = Array.from(document.getElementsByClassName('priority')).sort((a, b) => {
        if (+a.value < +b.value)
          return 1
        else
          return -1
      }), filteredData = newData;

  prioritiesArray.forEach(elem => {
    let inputID = elem.id.slice(3, elem.id.length),
        input = document.getElementById(inputID);

    if (input && (inputID === 'rate' || inputID === 'certificate') ? input.checked : input.value)
      filteredData = filterFunction(
          filteredData,
          inputID,
          (inputID === 'rate' || inputID === 'certificate') ? input.checked : input.value,
          +elem.value
      )
  })

  if (filteredData.length)
    result = filteredData.sort((a, b) => {
      if (+a.rate > +b.rate)
        return 1
      else
        return -1
    })[0].universityName
  else
    result = 'Не вдалося знайти підходящий університет'

  console.log(result);

  //дописать класс в каждом теге приоритета и дату со значение свойства
  //брать все элементы дома с значениями по порядку приоритета
  //для каждого уникального поля написать свою функцию фильтрации
  //и вызывать ее если значения поля !! и приоритет больше 3

  // propsArray.sort((a, b) => {
  //   if (+a.priority < +b.priority)
  //     return 1
  //   else
  //     return -1
  // })
  //
  // console.log(propsArray);
  //
  // if (propsArray.length) {


  // newData.filter((university) => {
  //   return !!propsArray
  // })
  // } else
  //   result = newData.sort((a, b) => {
  //     if (+a.rate > +b.rate)
  //       return 1
  //     else
  //       return -1
  //   })[0]
  //
  //
  // console.log(result);

  // {
  //   name: ,
  //   prop: formData.get(prop),
  //   priority: formData.get( pr? pr : 'pr-' + prop)
  // }
  // let region = fd.get('region'),
  //     educationalProgram = fd.get('educational-program'),
  //     branch = fd.get('branch'),
  //     technicalOrHumanitarian = fd.get('technical-or-humanitarian'),
  //     educationForm = fd.get('education-form'),
  //     offerType = fd.get('offer-type'),
  //     specialty = fd.get('specialty'),
  //     sub1 = fd.get('sub1'),
  //     sub2 = fd.get('sub2'),
  //     sub3 = fd.get('sub3'),
  //     certificate = fd.get('certificate'),
  //     rate = fd.get('rate'),
  //
  //     regionPr = fd.get('pr-region'),
  //     educationalProgramPr = fd.get('pr-educational-program'),
  //     branchPr = fd.get('pr-branch'),
  //     technicalOrHumanitarianPr = fd.get('pr-technical-or-humanitarian'),
  //     educationFormPr = fd.get('pr-education-form'),
  //     offerTypePr = fd.get('pr-offer-type'),
  //     specialtyPr = fd.get('pr-specialty'),
  //     subjectsPr = fd.get('pr-subjects'),
  //     certificatePr = fd.get('pr-certificate'),
  //     ratePr = fd.get('pr-rate');
  //
  // result = newData.filter(university =>
  //   university.specialties.some((spec) => spec.specialty === specialty)
  // )
  // result.sort((a, b)=>{
  //   if (a.rate > b.rate)
  //     return 1
  //   else
  //     return -1
  // })


  //todo map of prop: prop-pr
  //sort it by prop-pr
  //and filter one by one
  //if there is no university that matches filters -
  //undo last filter and show first by rate


  // console.log(
  //     region,
  //     educationalProgram,
  //     branch,
  //     technicalOrHumanitarian,
  //     educationForm,
  //     offerType,
  //     specialty,
  //     sub1,
  //     sub2,
  //     sub3,
  //     certificate,
  //     rate
  // )
}


// function FM(str, S, E) {
//   let result = str.match(new RegExp(`(?<=${S})([\\s\\S]+?)(?=(${E}))`, 'g'))
//   return (result) ? result[0] : null
// }
// function getSubjects(strArr) {
//   let subs = []
//   strArr.forEach((str, index) => {
//     if (str === 'Українська мова' || str === 'Українська мова*' ||
//         str === 'Українська мова та література' || str === 'Українська мова та література*' ||
//         str === 'Математика' || str === 'Математика*' ||
//         str === 'Іноземна мова' || str === 'Іноземна мова*' ||
//         str === 'Історія України' || str === 'Історія України*' ||
//         str === 'Біологія' || str === 'Біологія*' ||
//         str === 'Географія' || str === 'Географія*' ||
//         str === 'Фізика' || str === 'Фізика*' ||
//         str === 'Хімія' || str === 'Хімія*' ||
//         str === 'Творчий конкурс' || str === 'Творчий конкурс*' ||
//         str === 'Історія мистецтва (письмово)' ||str === 'Історія мистецтва (письмово)*' ||
//         str === 'Рисунок, Композиція' ||str === 'Рисунок, Композиція*' ||
//         str === 'Образотворче мистецтво, Композиція' ||str === 'Образотворче мистецтво, Композиція*' ||
//         str === 'Рисунок, скульптура' ||str === 'Рисунок, скульптура*' ||
//         str === 'Рисунок, живопис' ||str === 'Рисунок, живопис*' ||
//         str === 'Середній бал документа про освіту' || str === 'Середній бал документа про освіту*')
//       subs.push({
//         subject: (str.slice(-1) === '*')? str.slice(0, -1) : str,
//         k: FM(strArr[index+1], 'k=', '[)]')
//       })
//   })
//   return subs
// }
// function getALlInfo(_str, form) {
//   return _str.split('Бакалавр')
//       .filter(str => (str.search(/Спеціальність/) > -1 &&
//           str.search(/Освітня програма/) > -1))
//       .map(str => {
//         return {
//           form,
//           branch: FM(str, 'Галузь: ', ' i|\n'),
//           specialty: FM(str, 'Спеціальність: ', ' i|\n'),
//           educationalProgram: FM(str, 'Освітня програма: ', ' i|\n'),
//           licenseVolume: FM(str, 'Ліцензійний обсяг: ', ' i|\n'),
//           minStateOrder: FM(str, 'Мінімальний обсяг держ замовлення: ', ' i|\n'),
//           maxStateOrder: FM(str, 'Максимальний обсяг держ замовлення: ', ' i|\n'),
//           averageZNOBudget: FM(str, 'Середній балЗНО на бюджет у 20(19|20|21) році: ', ' i|\n'),
//           averageZNOContract: FM(str, 'Середній балЗНО на контракт у 20(19|20|21) році: ', ' i|\n'),
//           offerType: FM(str, 'Тип пропозиції: ', ' i|\n'),
//           applications: FM(str, 'заяв:', ' i|\n'),
//           subjects: getSubjects(str.split('\n'))
//         };
//       })
//       .filter(obj => !!obj)
// }
// function findBachelors() {
//   let str = textArea.value, allBachelors = [],
//       dennaStr = '', zaochnaStr = '', vechirnyaStr = '', dystanciynaStr = '';
//
//   if (str.search(/Денна форма/) > -1){
//     dennaStr = str.split('Денна форма')[1]
//     if (dennaStr.search(/Заочна форма/) > -1)
//       dennaStr = dennaStr.split('Заочна форма')[0]
//     else if (dennaStr.search(/Вечірня форма/) > -1)
//       dennaStr = dennaStr.split('Вечірня форма')[0]
//     else if (dennaStr.search(/Дистанційна форма/) > -1)
//       dennaStr = dennaStr.split('Дистанційна форма')[0]
//
//     allBachelors = [...getALlInfo(dennaStr, 'Денна форма')]
//   }
//
//   if (str.search(/Заочна форма/) > -1){
//     zaochnaStr = str.split('Заочна форма')[1]
//     if (zaochnaStr.search(/Вечірня форма/) > -1)
//       zaochnaStr = zaochnaStr.split('Вечірня форма')[0]
//     else if (zaochnaStr.search(/Дистанційна форма/) > -1)
//       zaochnaStr = zaochnaStr.split('Дистанційна форма')[0]
//
//     allBachelors = [...allBachelors, ...getALlInfo(zaochnaStr, 'Заочна форма')]
//   }
//
//   if (str.search(/Вечірня форма/) > -1) {
//     vechirnyaStr = str.split('Вечірня форма')[1]
//     if (vechirnyaStr.search(/Дистанційна форма/) > -1)
//       vechirnyaStr = vechirnyaStr.split('Дистанційна форма')[0]
//
//     allBachelors = [...allBachelors, ...getALlInfo(vechirnyaStr, 'Вечірня форма')]
//   }
//
//   if (str.search(/Дистанційна форма/) > -1) {
//     dystanciynaStr = str.split('Дистанційна форма')[1]
//
//     allBachelors = [...allBachelors, ...getALlInfo(dystanciynaStr, 'Дистанційна форма')]
//   }
//
//   return allBachelors
// }
// function addBachelor() {
//   newData[+id.value-1].specialties = findBachelors()
//   console.clear();
//   console.log(id.value);
//
//   textArea.value = '';
//   id.value = +id.value + 1;
// }
// function findUniversities() {
//   let str = textArea.value;
//   let arr = str.split('\n').map((un, index) => {
//     return {
//       region: '',
//       universityName: un,
//       specialties: [],
//       rate: index + 1
//     }
//
//   })
//   console.log(JSON.stringify(arr))
// }
// function setRegionToUniversity(){
//   newData[+id.value-1].region = select.value
//   id.value = +id.value + 1;
// }
// function oldVersionOfGetBachelors() {
// let str = textArea.value
// let bachelors = [...str.matchAll(/(?<=Бакалавр)([\s\S]+?)(?=(Бакалавр|Магістр))/g)];
//
// bachelors = bachelors.map(b => {
//   let tempStr = b[0];
//
//   if (tempStr &&
//       tempStr.search(/Спеціальність/) > -1 &&
//       tempStr.search(/Освітня програма/) > -1
//       // tempStr.search(/заяв/) > -1
//   ) {
//     let tempArr = tempStr.split('\n');
//
//     return {
//       branch: FM(tempStr, 'Галузь: ', ' i|\n'),
//       specialty: FM(tempStr, 'Спеціальність: ', ' i|\n'),
//       educationalProgram: FM(tempStr, 'Освітня програма: ', ' i|\n'),
//       licenseVolume: FM(tempStr, 'Ліцензійний обсяг: ', ' i|\n'),
//       minStateOrder: FM(tempStr, 'Мінімальний обсяг держ замовлення: ', ' i|\n'),
//       maxStateOrder: FM(tempStr, 'Максимальний обсяг держ замовлення: ', ' i|\n'),
//       averageZNOBudget: FM(tempStr, 'Середній балЗНО на бюджет у 20(19|20|21) році: ', ' i|\n'),
//       averageZNOContract: FM(tempStr, 'Середній балЗНО на контракт у 20(19|20|21) році: ', ' i|\n'),
//       offerType: FM(tempStr, 'Тип пропозиції: ', ' i|\n'),
//       applications: FM(tempStr, 'заяв:', ' i|\n'),
//       subjects: getSubjects(tempArr)
//     };
//   }
// })
// bachelors = bachelors.filter(b => b !== undefined)
// console.log(bachelors)
// // console.log(JSON.stringify(bachelors))
// return bachelors
// }
// function deleteUnnecessaryDataInTable() {
// let trs = Array.from(document.getElementsByTagName('tr')).map(tr => {
//   if (Array.from(tr.children).length === 6)
//     return tr
// }).filter(tr => !!tr)
//
// trs.forEach((tr)=>{
//   while (tr.childNodes[2]){
//     tr.removeChild(tr.childNodes[2])
//   }
// })
// }
