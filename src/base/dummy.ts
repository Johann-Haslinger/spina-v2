import { v4 } from "uuid";
export const dummySchoolSubjects = [
  {
    id: "1",
    name: "Mathematik",
  },
  {
    id: "2",
    name: "Deutsch",
  },
  {
    id: "3",
    name: "Englisch",
  },
  {
    id: "4",
    name: "Geschichte",
  },
  {
    id: "5",
    name: "Biologie",
  },
  {
    id: "6",
    name: "Chemie",
  },
  {
    id: "7",
    name: "Physik",
  },
  {
    id: "8",
    name: "Informatik",
  },
  {
    id: "9",
    name: "Sport",
  },
  {
    id: "10",
    name: "Kunst",
  },
  {
    id: "11",
    name: "Musik",
  },
];

export const dummyTopics = [
  {
    topicName: "Addition",
    id: "1",
    date_added: new Date().toISOString(),
    topicDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parentId: "0",
  },
  {
    topicName: "Subtraction",
    id: "2",
    date_added: new Date().toISOString(),
    topicDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parentId: "0",
  },
  {
    topicName: "Multiplication",
    id: "3",
    date_added: new Date().toISOString(),
    topicDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    parentId: "0",
  },
];

export const dummyHomeworks = [
  {
    id: "1",
    title: "Book p. 12 ex. 2",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 1,
    parentId: "1",
    relatedSubject: "1",
  },
  {
    id: "2",
    title: "Book p. 12 ex. 3",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 1,
    parentId: "1",
    relatedSubject: "1",
  },
  {
    id: "3",
    title: "Book p. 12 ex. 4",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 1,
    parentId: "1",
    relatedSubject: "1",
  },
  {
    id: "4",
    title: "Book p. 12 ex. 5",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 2,
    parentId: "1",
    relatedSubject: "1",
  },
  {
    id: "5",
    title: "Book p. 12 ex. 6",
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 2,
    parentId: "1",
    relatedSubject: "1",
  },
];

export const dummyText = `
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

export const dummyFlashcardSets = [
  {
    id: "1",
    flashcardSetName: "Addition",
    date_added: new Date().toISOString(),
    bookmarked: false,
  },
  {
    id: "2",
    flashcardSetName: "Subtraction",
    date_added: new Date().toISOString(),
    bookmarked: false,
  },
  {
    id: "3",
    flashcardSetName: "Multiplication",
    date_added: new Date().toISOString(),
    bookmarked: true,
  },
];

export const dummyFlashcards = [
  {
    id: v4(),
    parentId: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    difficulty: 1,
  },
  {
    id: v4(),
    parentId: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    difficulty: 1,
  },

  {
    id: v4(),
    parentId: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    difficulty: 1,
  },

  {
    id: v4(),
    parentId: "1",
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    difficulty: 1,
  },
];

export const dummyNotes = [
  {
    id: "1",
    title: "Lorem ipsum ",
    date_added: new Date().toISOString(),
    parentId: "1",
  },
  {
    id: "2",
    title: "Lorem ipsum ",

    date_added: new Date().toISOString(),
    parentId: "1",
  },
  {
    id: "3",
    title: "Lorem ipsum ",
    date_added: new Date().toISOString(),
    parentId: "1",
  },
  {
    id: "4",
    title: "Lorem ipsum ",

    date_added: new Date().toISOString(),
    parentId: "1",
  },
];

export const dummySubtopics = [
  {
    name: "Addition",
    id: "1",
    date_added: new Date().toISOString(),
    parentId: "1",
    bookmarked: false,
  },
  {
    name: "Subtraction",
    id: "2",
    date_added: new Date().toISOString(),
    parentId: "1",
    bookmarked: true,
  },
  {
    name: "Multiplication",
    id: "3",
    date_added: new Date().toISOString(),
    parentId: "1",
    bookmarked: false,
  },
];

export const dummyAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const dummyPodcasts = [
  {
    title: "Podcast 1",
    id: "1",
    createdAt: new Date().toISOString(),
  },
   {
    title: "Podcast 2",
    id: "2",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 3",
    id: "3",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 4",
    id: "4",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 5",
    id: "5",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 6",
    id: "6",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 7",
    id: "7",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 8",
    id: "8",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 9",
    id: "9",
    createdAt: new Date().toISOString(),
  },
  {
    title: "Podcast 10",
    id: "10",
    createdAt: new Date().toISOString(),
  },
  
];


export const dummyBase64Audio = `//PkxABk1DnAAVvIADXF42BiNkZjaGY2JaNQQDKgYw1NOLoT+vQ+7UOwiDYkIygUMIBDBAYwoQMWFjJx8xkNRbBgMYcJGKCRhwUBgheml5gEczUzVVNM8BHs2BABoomiaY4JZMwRTJNM0sFFuEYI5llmWOYoKObZAQEZSRsLHPKcsJurmiWCh2D23TRPMQQxBDECMIIwgAEAWYLwKaMTUzLvly0U2n3JZE12MQdy9E2ttflSwhactukWu9d6w6gaQ6RaDiKiYigCQhdwuQXgU0XWw9d7O3fn6jsM4VOqdU7E3Ll/cOVKSxuVv+1th6x1BFSMQZwzhnC7FAExEA6AdFdFdMdMdQdib92JQ1hhjOIcvfUf+X9lEMP5LI+w9FRFRMRUixF2M4Zw1xnbO13qnTHSHQll3y25hAGAAYAACALMFyEHFBFiKnVOu9r8P5RiMWMNyuX35Q/k5Da7GIQ5dhty3La219iDEGuO5OV6fsocty3Lcty3LZ2u9iapExEJBbAtIWkLwJgOplyJtbXeqdU6p1B0iExExFBF2NchyWcVAFAYFAYDAggQMYhdL82WMzDJBNBSIwkFTDo/MAB8ySDTISMMJJMwEOgsBAwGFZgMpkE0EBxQsssUzdcwMMzA//PkxD94JDo9/ZzgAELjEASMPEUyESzFBLYnBT+IQGjyeYFGgcYTccVMkIsxmKjMxXN2w9ncQL8RJ3DapjMUicw8vTeaRARPMAv8396TlURMBqM0ecFdtDXfFpyhMsEABCQtAYJFpkccjwfNllsUVhvoniMPmMXuZfJzE3qopfK56TofAgCBAMSdMGglkxiUJmj0aYKIRlQAmmC0awYRmxBGsFZZzi8om7duf0i0WsQrBoDRHV+IAEBgwLAMyoGA4RmdCMZeCBiwYGVhkQDYWSJANan/ju3rvM8sm6LUMIAhbsHp9ppoVr2MAAgMBBgYDAptGGAeCjOCkwYBAxhkUmGxyFQ8TLIcIQs1QADt4c7jrDDe/7zHWSBjXwUHE01/lr3CUsQBsHo3uUwZInQzMxAVzDINMeDFvDB4KMUB4UEzdR4khhjMDgokAZjUAjQcM4jkeDPce7/D/3///57/8N72yct+u9p6+kBkrasoHC1h0x23fpllOXQiL9zm9GJQIJBcAhUCAYwiWjDQvjwOIICBAKD6A4wEBCgBhUMAkDp2mMgKYpEYcH0jCAPFYmWBBlaggFg5fFimE+X8CoZkimjEpqiwoS+UEKdsHhp4mbts61VdTw6YwlyNHzChx40D//PkxDFsDDpgwdnQAAYAT5RbMOKMYhMYFOWmHjgiEDJExa8VKHP5mAPEMQ2Coq/jOTxpIRMDStgVbElxCyCDY8DJliAI6xRmp2B4GACyU0Q5K8xYEzQwSJBwsteY8KAkUPMjLlJHGLGpor7DAREWMyYMMmEaI0A4xSAzagVEiIWESC2hghoZyM0NDCQBBGsChCEIekgUFAiIOzQx5giAPuWzvqIMCR5UpcJgDBxoOyN1WGrAAYEgghmHE1biCVfC+l1gQA3isaOLUEFy7yM4cCHAoBAF6UrSIGrY5aXA0WQbFRYGBCoAxgAtOkKQB0BC6kJiHFEItOmEgNGkCYQGFRteqDLc02aVckvhhFp4n+jDvukLAi4INDOMqqr9Bx+4U9pCLZY7jNkDWnl8WdI8hUIwMiBKUpHsVBoNrCZztqNr1cVEFYdaKwK9Eo2iuNNxZC5TFhKVr6uSkY2ZncEuxPrxUuoU8CsGsEvZvJC3NBRTllqmUSbyPoQsaSfj7LLzAoGhhrKz06lVmnoQKjcpBA0PNVNw0wERJNmRBYYpH4gBhi0dmHwATGcwSLjBwjJBMYWA5hULmBQqDiEAQ6HBuSM5DgGYLC5QIDCQYMDjIySDwMXwsSzEAjDj0Zckh0Zv//PkxFN5LDpMAOaxcIQ+TBC9NuHMwkbjJhjJBeZDEBtxLmGFgZfRZgREBQcGVwOYnFBjwJmcmGCBgOhsyUSyY2mRBGCgwIhIZcubVIb98BThtVQPLmvaGVRsUWGELEHOTXkgUmAgUy7AqgwMUcNI0HCgSFDjLX0/jWsgKPCAppl5ghRn0I2QOWsSNFVpqjgkuMcPMUzKCIEPmMIByAHDi3AOXFlDFgkn1gS3SYydSIKbDcxEAQRl2FRjoMOCr6LfmMBpImBCI5S2UJajQ1USlRgArDTAhkui3QYWMojLqO2XFdhP48sLNKAuOgBEBCb7/KoqRYsrwlCcAsGFBhmREVSIBUTSCw0NWJAZKJ0jHRNRSkUrXowFCUFzBplAUJyo3eg0EDTUS7X6uZNFjrjOKXepEMXyVtViFDiAKghv0bRIykQXhWIGDZyFBltFviIIsV0UjWTICnHYo5iDwJWCkt1IlpAqdKCqbsFixjIks3UwqQlUcj2W1XEkEhg15dbYmHv4IjIroQrPTKXWMkbZgrevo+q5GINbByWHWmhP3Q9Mk0KQw7BvTcBCnNXgAwyuTBTUHVTMI0lowKBtDLQDbM1Yrc1NT1zQtULOM6iPbqYNdCqNbFcM+hWMghMNFlgM//PkxEFtvDpACvd0eHAFjF05zQ8xzBgVDGQPjBYJBIbjGQgDB8QzM4+DVgKTH0KTBUwzSSDDMq1D9yqjZILjJgTBVSTEktzMgxDSwbjEdRzZ1YzQk5TDpLjSkoyZXjD4pALEN3VMHRM0RNKDFm4IEmNIjTYyoElFotiJMCCAkVLbJ7NYMAqAgoHLRIeHFC7IQALLpDgUAkUsM+0iZnBdLG4cXkq9csCJEjQZr71LKb5S5y1NlDmltVZqpGKxdS6IrFdRDVrMTf2UNsvZsj42XSrwmedltYejEcn2utZcKUqlTl2+jtNxijnSbaxXmaVTQYkM3zOYbkiqspo3whbLXaed1XO3GJmKQA88+xJrNDJXFl0yzJ3mHRWhay9j9NOppBSyKzNYSGYfdrspd6LRViLOatBKH6dJ7rLXaJ+sZbEZO0l2ar+OlB7IS5KuoZbWPP1vGI1ZZG39YUmM38uZcuVo7qqDNnpJ1szMkUmfLGgiSTbzRKAmVMRa7NMqcq3A0XXagYJqBTGAxhXpkdiY2YbaC4mBUDb5hKpEEOCXmGVOQaDIGhiDhtmz5VkbqqeBksqMGW9WeYXIYxjar4GoAQgBAGTLBPFMFsFIwSgsjFAH8MEYHwwwRNDKrFFMBIA4//PkxF14NDowAv+6PMkAj0GBKGH2TMYFIhJgiCymQEtWadgl5jdsHG3SRebgrEJl1l3mKE1kaLxcRhjIwmcIJmDZemr7+GIaFGOJBACTDLNBArGxzwxhtQdZn6f5kYXxj0JpnCFpj4FIXI8yPEkwEAExVCoHBgAiXMIAMBAQGFI/GCAZGBAeGEhimFwImBYwmj5JGMJrmco4mb5jmGQdGAImmL46mG4KiMEFNE2V2KWMLhxnrToxSPe0hVN2FFlXLiaQ28MKquQqvOhAEg0FlgSy5VAMwRA8aAFeSOKaLWnZWBh+PQHIYCxibIZLp2p+9fypsHph1rsbmZyIUUYpp567Uln41HITelULjFyvDdfB/HSdqBXCfZ1oaruK4MZnGws5m5VFn8opyMV8e269DJIhYj0cux+exqRmVz2T4QTMwa0SJt1cKu3alpI/F2nwuUMncieYA68MwHUnnSbv7wtilLVGvSp6LrerzhlS9xmutu5bEpArJIJI12GKN7X/yh5YR4I++z1Pa9L7yeKRByIx3gOzC1JCNGz6YyjRaDGmCsPOw2UxtglDA/iYNIsSswmARjZZPcMyYKowvyVTuNbgMUMCMwdCfjXaDxMIwJYx8gaTH1CGLbGUCMqYEwAZ//PkxE9zPDo4APdfNIGoW4OYfMF0AAwYR+TC+AuMHcOwwtACzCxAyMIgPcwSBVTAdDiMEgH40KxPDAYBzMFVMw2XjdTCbEHMZcEM1AOMCGjOrlWMSVSNIqJNOQUMLx0OQdjNUhsMuV2PT6nM1SyNbilNUA3MAxBMol8KGBGQJNDCEMKgBMADkMcAqBQeGSY8gIMjB8jTNEMDDcHDCBWzDMJxCFZjmexhQApKUJggXQoFhQDBhIACU5MA7FmaL0btOS1vFKJqSLXpHFa1EF3u5By517KkS3YMIADSjRVUocJXRWDSXo8CFYuek4Tsf5tE4L6VCxHnThK2ZdoWci+q4rGu40FvpHcnrHVcRY7yKrqWZpGfT2Oy6hKiiv7HO9T6u8JsdMtFZLlWLCcam44FhIKBqjvJWmGc7K/UqvUaFqBhS7ei4CoMhxP45FhXv3jqOnFk/1MpIsdcKy10IQiGox+PW1QQjmReTgMs8zfdmSdZ2HePULWMBxNI8SXi2HAWJnOpiPlJFsXLieMbjSMBADUeC5M/8GEyfgDTDFDMNR8n8wuwXDBKNqMesKgwQAizAjSFMCAJ8wQAVTVoGTMCsFcwfVAzoNVJMwAYYFMMYKguZmDIBhmMCCTMQSEAwAgw//PkxFVyNDpQDvd2mLUxQB9GQxxFJqAGAcxrGQwYCAIF4y5AkwOFcy5E0zcJoIFIzt8cwCBUwQH00WIMxdA4xoDcy1AowiBMyEA4RByYAh2YrIQYTggY+gICl1EAQGAYNnwIScRkbiIQowkmHDFK0RKZi4KFgU0wlJhoxMzNyMDGxIwscLcIalpkVYg6aZLEI+vSNvxJrdLhWlz7w3Nyx9H8UMVxJGvtTj6vY/WYE09rDgPHD6zVJP296SheRMVsqwb1oC0U4pGXIjNG/bpunZq0+4GhqUdgacj0b+rGpRPTUjgGKwK/FWItOkUEwM8rrRWMu9x+m/kMYgCFQmYjsaaddgp2Wbspc1XcDww1xrCr3nZZBTotMhpTtpU+2dUr7MzUBctVVqLsMKa9kp1hSwNA7ZJC2apP2JcwN/WAsIbEvVcUFr8kaIbAaVbS8XtQviK+Ex2pKav6u8iAXQC4Sg4IAAvcDQNYUhDk1AwESaUJQcDAgQBiH7eqHNdVwgDVVTCvAcMCkH0yAE+TCLAbMA0eEw9SJBIBswTDTDG8A6MCABAxoBwDADA7MJwcIy/wLzA3BWMI4eIwTwRDAZAyOliQwWDDFxsBTqBoCMissyAITABNMyiESERi0TmQAWAg//PkxF9j/DpYAPcevIGRAsiUsUy0ADF5TMCp0zAEzIRINFWcwOfjCLGNCGkDEMwajjGZiCEcZVFpjYYGHAKJJ4xsATQxbM2kAQgcwAIgQfzDbLMnH4SExhcKggKGHwYHIUxKBwUWgwql8jA4mGg+IAqIAoXgHQAMAssiGAmu9VLaYzxraMzsinURlhCAmCpN6hc2W6oZmt7An1iM4s0pljkEkIywm+A+CBkjFwY35PGFzb30RgcI9pY8Pcz+BWzZpkf3+L1te2fu28VvePfdqfWNVzN/R9HxH8KHAmZkQ5yt9Van3B+llGpDhLmpmE6ykY3Rc9D0x0MJ7QnjOml2gILO2K0t8ifYFOmlapY59IQgU2hBPWUuxgvzvOiQY5JR+FOSAjbUIuECDUE/OonAWsggN4MAwyLEMJm2E0JGMT8CUwLwrjGqfsMLMLAwyBiTcgCgMKYMszRR5zK4BpMHQdYyqg8zBcByMFBFIzPQwhAAma6hqUI6YMJkYOg8HCgYlqYYJgsFw/MShiAQFGNg9GSYHhQGjHwYxIIRUTiYYTBQdDI4FQU1plokhjuFBh8BBpXJBreRRmMmfljjyqa4WAokMYPzMFwFRZiZYeykCygRQBlIck4bAuiUSYRCmRlh//PkxKJklDpMAPd2kIIigQ9NYBTDi44tSQkmGA8cWAEAGCgESFS5rXEqXMWNbuZULWXll07Lq0RehjKxl/qxjwGX3BgaNAaKjrX6Kzflssyq4++splVBTspaUnKyV4khX+laVrxZQmXpWP647KHntxu7GMKXlfPCVWbOGPKWm1Kt1bXb+Va/Q4X9VN7/PCvlcpr397avZ5WoZ/GzlSZxm/EI3Fa763n1YjZlE9GIjAj6u7Ar7Wakjo3Id6KufnE4dtxSXRt9Kr6yitGYrEHriUfsuVJozHnBgBxF2sxZFPwuzDD+QGoc6inbeK3Ngjbs0tpgMyX+XTMrtqQK0epMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqoysRFTBwCNNse6cyIBeTI9GYPH4CwyMiVDh6TJMBoEkyNQFzIGBDMFQD0xwxfjE7ECMG0GsxiBGzAcB1MOEhIwVQTTAAA6MXIT8wGgJQaDaYVQKo0AuYfoeRgigWGDTYZhJBhcLCFcgEYGCP8afCYYKjBAIdgwcIUkjGIyMGhMx4FzDQhFAADgUYYEJhMYGDw4YBI4hIIkNzXAlTeBooMSECHAqJyZAmFhqZCOYQeVLBEDQcAlKlRPw4KvX2p3BtSfcM2I//PkxMRl3Do4AV7gAK0GVLWjUapq71PO0UYAeYiAbMAaAC6aoZq7S2N3vv38uz+MzZuwDqNRaMOSxFmK7WIsNbVYVksNUckgaWzzw4WohYnJ2zhLP3Vvb5SSzXLP1dYbr4/H9Vq1LNvu4bpx+GJifrYTsodyWRyXv+1t25+cyl9WVz8dxn4lDEXZJAr8SizAlyCYVCX0yhuC4B0+GMWf+jvSCB6eDWJrocRoF+GGySt228jceUChqHlXwwviHoYm7lNDEWDAGhu9SEaRcRh+mWCbIz9StrrR3Hd+y8j6T74VAA0kgAOJB7O88bNPfEObYMNAVxMcAjN66CM3ShOLQmARkBUpi4A8RZjgOoOBsw5FYmBp5jBDQwMLMUBR4Gd+Pue68qd8WYkz2JQUYSGpTTLHAcHmEgLJggGQQpTFQxBQG2Z/HABoGXLfdsbsigJFDGAFb7XZh0ay0lzW+Q1SKWLkiT8LDPBQwHTWH7k7oX6svkDP23UGeeHpuDi9gckCx9Q3pbTzGol2Gk8QMDptl2y+aE9Vy/ASImMiY1DtoYKBg5jDicABgoFBQnvQy6bvxRkK94yxtjzJG4GTlIQPig4ZADmZjpyi4GELXygHMKFiYIDAQcbzVXYSuxwpNQCz//PkxP94zDpQUZ3YACWPMXEjFhwyUIMQBzNwc0AMhCzHQWDTuJgFDNMMvqkmtgt9Arj00ZauYkAGrnpmZiEFwKL0OQ8QmYFxlxQY0FFYKYEUA4IAAclYZCKmHGByFwXkMCPDMjE1RfMZOzAAEws5OmOjU3gxMqRBDKQzJEaWsK6q2KzDlVY+6ocBvS8Sg6A9NRCY5a+qNMdERXFkwcFCxgZYIPysMgAMiJhEBpjIckPUJ4wEmIiJhoKsZDWDU0xoPQUMaMjNBYBBQCTTIysaHzFA8w8iMeFAqUoqmPBRhI+PCKHUOMwwgZqYCNiIHX0VhSpmwgIFrlAxAOegIgHbouMvYtBFBpz/ttVbm7TpPqr9/JXAenHbShfZuLpwwsctgkWIBRkQqk3TTqUEcR3m/bHKsJxjCqihMpeCQYQMkut6bUEgV1FB4EZ+xN5oEmmJ8h+db545e6CwaD5bNmSZRgAgkELsGLBhgow5cEiDJCjClDMGCIgCRxpBZQqMw6FgjmFgKYVib8KmESszpsQUTFnp5do3cBlA2QE7v8bLmuQMlM0EUyKgISPo9mNGj1QxREWHGXBm1CgI2KEDAFzSnzEMjIySjMXQGUABPGIap1GaFEUkAhx4+OETJAxQQMAx//PkxO52zDpkAdnQAKGGNPmcACFO9ZiwQJCmHHmeHoLiUgybIzb1RYRATFIgwUZN+aQ0oIZlMVChiwR2kBmUZAQMenM7CNQUMkvKqYywIaqmPlmVjGyFkRESWAVmYfQkWZJOMITMCjNLghKaI0b5sZZ+SzC6BtBoEIkw8SNERAxQcAizPLAd0NeLGmaN4AKphmUVGNChZuAR5lgRd0eGA0ybMS4gGABk4EEDFDQhGIhpd4cIgoWKkxCHMuaEY4wzIUEiECgnLAVC8QhRCDSMEIhyBGCJSIVDlYJMJ0FzJGJ9ggKXfeR+gMTAwUDHo+v5bjEA4WngiYttdVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVRaLTFjWlswPSvI3NL92ISq3NuUPPw48Hy1T7mbdmPReUxexT1qeOjAEDCHgEEfTuWACKaCMYBCNCjEMOo2JmS6IizZsLMHvEiOQ4TgI3spyWI3Zrb6OU3d622WZGbiJ6AtF54FMUi2dGFQosmDFmVFjq0z4czF40jAuyF1AmrM8RDLqhhaQFCzEHE9gCuOACUBVRbsWvOak3ZiK0yrgVyIozwjDkwYuBxQsCWdCgBoBtDEIEEJcGCAoCQMCjZKXIG6KsDFkNDFK//PkxMhm1Dp0AMazaCAMuAv1K9CgVMTwU1DgGRlUNlhb4qniIJtmGw+RIigi2ErmYNYMMgZHAgYAHcp3QqOSgGWgrpOJN4wFVGFDASSAEjQlNJsACGUeKoByogCaGIEkBYILSDX6EHGeMRGmAGASUBxlwCIJ91KlHwsqCUQ5FTBhDHHFAxoMHBAIQCgiHRwxBJwEgFnBIaIu6XGHA095SQHpcCwzoI4xxukvTbRnQ1cV1SYd+2lImPK7bIYDVEwBM9S+mTNbo1hmTzUrEV0sWhlTCAW5OaxBsLwzzto2qqdVMLfDzlQLk4kDAwHydhTEqAQQAsDBwCosxamh2VV7kupWevQnemomdByUIQHlAwNDxgwAHFYYgjKkcG0m3ppqCAZKKgoGNKazQCMLkhg48YudmmiQCCQEBGJBphoMYIFhcGa8yNYccEDBw8HGKTwWKTCAQBCSYTWYwrcmsFhEx4NR0WeYAJmAi5nQWZeWGNjQiLzNg0x1ONJDDRDkwxHMOSja2w3WYOpQDRFkxQ2CKY3izNXFDACUzg7M6PTTFszQIM1HBINAYalI9glGBITKgP3AFbAFgwXzfSLALDzORBRBroKFrpWEVgbOm8Dgi6pAQaISPzKlMXAZcpkvMxgx//PkxP93lDpYAN5x0JCLJGOIs1kxgImgSDgRUw10gwphagSQzho7GWkZoCEoDBKDPs/r1P1BpcFJGUsNLrPenLwEJnBObhJgAmMSs8xFzWPS5AiZuKmYycyJizFYwFENNIHFNssVh1YssBWgVcXtMBM6tToNUMMMQwRjEJMgseEURABJqNmkGzVN4xGzeJArhxvHHUcqSiJg1HnIZgIXMNt4OmTBGRDNGcdVJlr6u6sE76VKlr+gRJngBpM3UwNqhYzqsSZSIAg4KuW7FxpeXlVYXaVWS6ZC2iQygzrYiFRweoQ+c5PSRTJOc1FVTEFNBHgauRfpjNACGHOIYLA3gwA8wLgHyYBEBABF5hUAhdVVItAaDgBV0JNrYayvoCgDJjT6CqPi00AIBDgOCYCBphQLhQGA0cgpomrT8aqmJktImmgoZ/IBiwZmBR8YFHJk4KmGxMIhiMiEiGMzLZ9nJhQJioQL/kgDFQ0HCswoAzAoSCgnMWBlTR92nSluywZb1gpgICpyEgJJAOKAQECMoIAsFzEA1MdEExoETEZcMhB0wgA2TmBg6YgGJjwAgkBBwFTJEQWFgGDgiOgswQBzA4kMOgpAiiKW6Zkk2YGDIGAhEIjBgXEgAx8Ggww6CgoD//PkxPBw5DodYV7gAEmCCXTVkbi2RgUDLQUvBQNZZBqewcBogr510MWNQGtJr6vVYkQVRPEWaea+pjAkfitKXmLpPW7sHNafVczgxyLSifk12XMqaapUzZ1aZmKuYk/Uufq7Suk80VYc8MBvo9b+NaTGgeStQR5Y7VeFxXZhlyZ1kTwtioYMZtAK5VhXegWcoX5gZfKegkCmfSN1JPIYeswXGXJeBlLSEfi8qCqzQSAGSFqmbFwmDpqsied2FZlapYxcvC3Z94adGvbkrhQPACl06pk8Dzx9/Yq7SgyII6AlOQjZKwrNaQWMRAqOdUjMkw1MAgTBQOgYTzIwajQwXzOUXw4EhYDDHkdzMEmzFgRjBUpUTS/wsCBmAUBgco5ye0JiSnRgUFpk8gI0Cpg6BLGV5G/RBm36vmSICm+J4mh8gHnc8A+0jWcBQECA8ACtZZydMglYNjjEMVyiKEJMXQ3MiF9MpjBMUyBMQBWMjgGcxz6eksT5EQpg2CIcCYCBwCgeNAeY2hcYPggYMAsYEgGzt45ZGZawJkrPi5wKA9IxqyNJddN4mB9UqkG8X8zBO9TRzpDKo/LYnS1LiQjhslLfzC/4ci7sv0spZUDr7d+B0fmnXInWkEhk1LW3T29O//PkxP97ZDokAZ3oALskbdubO3koq7UXjybA3R3G5s1ZqxOJvK37Bn4kdbLeOd3u9X8ZdSYy+yvR/2muOsRsjSU6y5bAkBhgQCxgoBgGBgiC8wGBzGWrPeF2VtFQAngdYwGAYwNBAEg+AgGMJAGMEA2AwByaBX9nLUUajk+tFOvl2W0MLjdPbr504sChguEocIZgcAxjeKJh2F5hWCYsChUAYDBIuoEAUJAQ/gNAVUYBAEDAO6BgABQUAcDBOYfkqYTiIZKhQYngGNF+Di3MQwkMBwwMDxKMGgwMZwPMNACIg8AAOjweGCATGAQdmLgBGCoJmBAImHwdg4EVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQh4A0RQA02cg1cNgxuG4x6EowpFcyJM8z7MkxLNg43ZEx9BEEi0YjA4BRVMCAdHgnMDglAAEgEC30MQwIIgpAwimAghmEgWmCgNgINjQg4HPwCTTKEQwd9MeWzRBs60TOdIzJAcxUHAyuZWQgYgFAsDf5jR2DWIoXyQCMHDQqBGRggyAgkETSJAEwMCUm+qCYAgiA4VA0TEQwUJsIeR2FCoLa7Ay+2+mZHXtQ1XlO7sXfvSm7WXmXaqg7D4//PkxLxj3DpAFd3YAEbgWHJVX1L57NwYYeGggWT2aXVK8zYbuozflsOPy7UZiTpv9Syt+HarzsUuzEspXUpXgs3NV6m6TLOUxqep69HUq1a05UiucUoY9uXSuzDFdx4Ff67B89DtmAqjDmMu46zSWazkUnWlOssVurAk0Vqs5azDsnc1l0RVKoCyyIQ1EG4gIBYarlTVnpbItMsW+8kDIrRx7m5LBU7sQE2ytzRWGJ6pkMncZzS7zc30GQF02dT0hVImczCHmSsZTwZeyhq6e7OW7kwK7sVZI+bPHqehnb6KTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqoBpAMMDB+DAZCmY0AgMjMJCE4DC+R88wl4DZMICKGTDvxjAwoo40M8JCJDC0Rfkx8MJxJWvMLBkMSzXMlzOMBkhNXQkMmQwMrixAShmG6GmPoKmIhcmeosmGaJmZ4YmHgvGphPGJB8GOCbmNYpHLgKGX5HHyzKGXKrmGXAnqajmRsQmu62GWBnm89PmgA0nJasmR0cGbYkCSCGEwkF+TbrDQMDLNgxIKiDJi46XPf0SDl7ExFKwoPAx4xwJdxhIBkIZrxIQLKoomqIGmJAwOmOwCJy6StwicPt3nF7pCtZcms3jCmk//PkxOVuRDooFP90eCz1bbzwpjRt42DNVbPk5DxPpDEvV8z6XR6C34fuTq4m4KZU7j9Q1RslhL9RSvOPAuepFXjWxGoEqRl8KWBn35uepLWfXUzzsQXDtl+FKolHZdA8/E4FbrJYLlF52H3iMp5GXch1n+bxwO7zL3GruCzTFYKNskcicU6kTY2kthcuMsuhThQl4Y011q8zDKLz9INstdqLuVATvv9PMxldZ5k9t4KmTGYi4K5ViwA4zuP09s9cS5Z2wSFMQYk1CMsMWUxpozGHeg5ciUrEaJ42Gs1p35WBTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqoAsBMSQEgxFL6DQ6OFMU0YgDvPmPCW6bApOxkDhknBK2qYNx8x93bhGiGfoa/gmhiLBcGG4J+YEIK5inCHhgXZhRCwGBSBMYYAURhrggGAcAEYd4SRgAhxmHGCQYHASYUD9MEIJYxLQUTB9AzARw5h5gtmYqGCYxIfJqso9mXGKIZJBpBgoAYmO8HAbHfR34XmqywdUfZ2OeGnCie4gZm7tHijwZyXxnIUmHCcYoDoJDQIHwGBBkYPDIkMVA0LgoQCMMJQgG48SDBwkMNAcw0GDGRDMeBAwcOTGJUMQC8FDEOVyfCgwFAo//PkxOhvBDosFPcfLMAB92QS56nDOa9R6P8sR+ZH4TVri4XlMfxUJJcE6jDuOVgJYnml+PsyyThhi2uYfrAzjyVZyEuS6peC4nA/VD85YbEcR3RpIm4Cn0xtcVkcYyxZwlYFbOr1Oh7GzK9ct7yBuPdnbDjXzyO9iHWd6NMsekxxSTLDNZAj0EgyjFuWzCL2uEJXywxTBgJ1cMKnYTRXCdOk3Xr9LuDmcqvbZCpJKpk8ilE5F2QonSeQ1QlhLiTmyRQ1SyoxRHSrmtcIWnjxZGVehoc5RmI7R6TpYSCzPlFDTEFNRTMuMTAwqqqqqqqqqqoMAmBpgzZgrx3EYj+BhGBhiNJlR4QMYMOMRmBvA1xhUohSZBaG/GE1EeBoJoGwYXINiGPiikZgigH8YamBZGCh/HMopGdplmqxMmJQQmwI+GU45mm5LGM5ZmaRTGBhlGqRRmiYimcaRGfZYmBhuGUZBGpg4HFBgHMitn602G6bCHNT9myYsGkaimZ6DGfKGGIS4GbLsGihzGMiomaoCGGClmF5bCBLTHxEDAQtTAEWjCEdAwczBoMzDsKDDQ0wl4Cx4Z81GVrAOlTCCkzlAEJQAYo0kqMuajVzYz5kOTWDACM2BLEIGZgNmCChgQKA//PkxO5wbDooDP92mIIYegBSsbe41uJPfTS6QskY81xNZiL6NyjCwkogrsQbxrNO7bqyt4F/Po+0/TdWLRtaaXBUEOKwqHIxbjUOTWbJ2Vtak03D8JsSyTRPs5zG5GaKgq0cPUEru00xKJBQvGzrk1D8ZleMutWpHTQVHJNQxGAYlaft36fCMTlLSRSimpbg/1PUpI5O2o3TymifinkcRppfPSupXoYbtS5/IMoqj79h3KvqYchmDivw1h0J2MQROwiGZPegxwH8pH0hqIO/cmH8a5AEYpZ6IRmchcvv0W6lTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUOrGEcgmRgSJnEYaWBBGD2AaBjKYEoYHoKQmCSAoBhugUyYL6BNmBMGBxiQobeYNQhwGNAhGhgoYS0YFiA5GULhGYoumRhoGIA+mNZ8GNYrmNx4EouGeh3mDgKmMqBmK4aBhfmOgfg67TM5KjeoTTSynjfaCDql2zU/jjeQRjS8jjRELzFQQzAsbTOAaTBARTDgLzDkEDBMuTMgczB4zzQBYzCoZTOpAzJgoTCQrwcWJg2DQXA0wSB0UcNz9CgEWjlQSUjmbi6PptSlRA2Vw1wyYwGYdQJknntigFO//PkxNxr9DosDP9ymEfKgSxQEE11rtaL4024Ol0Vd2NXJyLRqLPi7LhTTKqKLPTIXplMekEpsRKLTkrgWLQ1DjjvZGntjjivDA68Y5B7WmtVn1bpFJLCZVBFHK5TdjNJSTENUF6mgCxAsHxVTqrMV61SZjEnk2biw8/1DMTcSvPFDcIa431mFuDKozAUDOjFI7Syt+a0z9Smf6XSqvLa+NetN0l+inI7SXMZmWxWxKpVGr+dmblNmieJ3nBisPUkW1alrtUW35tR2mdqZo6d0WItNjlqTw1TSaWT33ZTCY/1TEFNRTMuMTAwVVVVVVVVVVVVMTdD0zL1y/Ax4kcsMy1LwjG9QoMw3sGIMJPITjH4RroxH8m4M5SNYTTllNE1cRE7MUCCEjBIQk0wpoMDOOoTORIXNoEtMLkvNUFhNqF9M8A5ApDGjq1GwrHG949GERymt17niykmdj6mwQzGFrLnVicnOPOHZIdGrC9mZ5CBYPwUHphUNpksV5lAMph8DJhAKJkARpg6F4yHhjuOhheCJjQc5qoPpmKVRhWB5h4EoNAEwOAkwGA0HCHPkArlUTAnNI8hGGg5AY4wyObSIaCW5AxIYMOAowl1QIGWRmEtR4l2nWaWnsmmsI87DX9Q//PkxO1wRDoIAP9ymHoiqSy0N5m/pnui0qYE+yGSpmdTDGmGvwiksO+kQas6LjRqrDDpWZqe1CYq8k02Nlstf2DFDWTQxBLdJcvBp0rjy8FzQ1Pt69UNMIVifRyGxKypCvq0piT5u/bpJRUvyV9HmoK0PUbEY470NPtUd+ZfqfgmrjTySJNyfOdfqbpoXTRGKOs+sgh+E08StWLHH2kbTXggmgd6SUMzg0qCWvSp9XJuLuZjRWm4w5KqZurqLOaLSTThurHHKi8RYbXmWOsSb92ZhrUanmHSWcZU/8ck7DXSTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWAzaqswgGYgg8wyLgqTJOGnMHYLQyURZzDgAVMPwKQwXUBjDQBsMBUBEy0z6jAEDiMBoIowcwZB4CMwNwNljstMD4FFS150flhSzxgEAsmF0G+fNwMqDAszJF0pAu/EEw1oBQdm7XS+ikkJhcQBIp+BZaFhJEcQ4hAUQiEV0CTzpisNdNVqdr3JpmFFOKWySOMGUSeTtgJRRQBJhhaqXsFdBVJROCm8RIYmFAi9IqwSDmEEoxkgciXclavlvhADZGy1JNt4Zddvn7e//PkxMpndDoEVV7QAHham88uJNZ63CeFia/2/jyn0b4YTnRueJ80+YMdthLNoyuxYFdEthtHSSQKXGWpI0bHVLNl60+y9yMyQifiqkqacou2Z9X1bK0doTSlMWhTbZVbpyA3+idI0h4lOm1ikYZRLGduHFYJisMORDqDEUyb20yVx35ddynrcNka14oqeNM6ggvm88PP4rS0taUUfxy46qdz2DyhxV8MsnZO3/Yq4MOuuuSHHHWJJp9TNluC8Wlrni7vuQmgy1YdXkHsXaE76lbT4ObBTRllLs00Nv478Wh5PuYxMeCwOqgAcxZyHjrQFkMIAUwyITvDO4S/MTUL8wHj3zEUGrMjsZ8y+gVQcAkYVAEYIASBwJ5gUAPiyACCwsGCoYuOQhkeUGRwSBDwBHkIpiyiwYTGAKKSnkrzHjC/AXGlriz4ACgwAXKXfIi9YCVoDUrEbUHXYAwpjZKBSSSXLXBQChiZIaXjRmAxB/F9hYKWzaWYc8aAECAIOLoTUGSYEbRoEJh0E0gFD0tgAABJEOJjRBMNtlkOOMLUhDHJBxADAKbgCMMjLkBU0DkJmSBdZPotEDQSwygiOoKfgQEnMttQomHF8AaLQGhg8wZ0xZMaBgZgChZegxIMHiVK//PkxP95LDn4AZ7QAIaEiIUAST1oaLVEJcImLaDnYECExMCmjCjRUQGGTACjAmQCNSKKGpqF6pgISMAEC5swQFOJjwGGGLAg44MEQhWmmEAAAUMWYCDjfF+gCIDF5asMJMnWEVXSuR3LcjIhawWAFviIUQDQMNGloVCqUFQM8RUGPGu50HFS4XQt1AYIwgWFEgh23/SIMoKLPl1y7aV6E4KCl9oLJRBABiKLaH7rvOhom0IQTKyAEDiSeiOzOQQEm5ciklWXZUxljcmnF7kc1rVl3mJCpgIzMJQC0yRKj6IC9E4E9VH1LWXw7LXfbsNA2DUiEIHJBrxFphQRsxpAqwqAWYGQARgAgAGHQFiYS4P5g9AWoGl/gsBMYFYAKYoCADMBYA0wFwPSIGFCWSoAqEGhI0ILxoWAIKow+xkCItDA3sAiFVgYHEQ0vIs9oMKNdMLB8naHJZnKcGSJGnuLeMGJMIFMMLY6hiWiVoAKwOum1WmmPkYs3iBPYv0AgY89MkVEZJDgChS+i9qlCkjRjAE5OGpLDUa1GeFBUsZRKLOAaHChwSCg0UWxL+g04xbIHCljmEDmIMmbDmPIiMwDjhlgxgz4KLGnAhQwn45KKxiDwXEEIs0QMs+s0DBn+dpQ//PkxO11NDoAyZ7QAOV4+TaOmZBQJATSDEK2CDx8aCGHDpLlwjDDE7FwF4lrhyJUpf4vijW6aKoVCLdkElVtX6oK3d+FpSaFOo11P8MFpjoAGQokgYWn8W2L0mBDlguGDjOFCEkDjLKmKsqnnnLvQtHHGH4HQkiAGsE30ff93n8Yc+tFEZiWNaqQMuO5FZs05EwxcSJGGGLGEAtxjJjTHKAMQNgWMS1DoZqTIwcMsAFACMqIzSlDDDg1KWJgYC1xuzWkZVyoUAkMFxAcOMEZFAoGAjIBtkUmnNdh90YEiNinuS50I1yXQ1SwRk+sZcmeeCcemG5MQU1FMy4xMDCqqqqqqhAFEb+sensf34fngevMenYff4fncbASZF0dO4d2oclwa1EZ9EalcbFcZIKVABkThpVRrVxsWRt3RvXxvXRtHqAGKYZ5xmkGKEYIBggGCIAAzEFMQMBAltSyphEmYiaS5lmGSEXyhbkvABSjZiOmo1EQgVdqQpZ0wASzKKKQpdYwQjFGMkozTjRSNVQ11jXaNBk2GzadNx02FTOJLew4/TMizxZpFJl09KmVMubsCQjJMM0oDFNDCgZmJms2ZphjhGCAYYxlnGq4cth69H78cT4GZeRlSgSQyKyKyEpE//PkxN1sNDmsA9rIANLulpS8KYLq0DlMOYaqVUqxWIw7hTQ04KXpd0vCmDArSi/xaZYs5m4KXqRLBYMdZYIAiGSQY4Ra5dUPSqNYQ01pnTOlhkTiyxZpkrckTkAyAYu8WyLJGCEXJQdSFQklsSyIABAQIABLvJ1Q+nKBATCDMIEtCWRBIBhhGGAXGU2d52mHKBM5d2HZbZ1lTSqllLssNVKy2OKZISlStdf29Enad6XTT6sNXaxF3Z2tDUawhprTDl3LuZ05TvVHah6hYaqVpsxDzxIJiyxZpFKB0bTAHMYeTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq`