/** MIT License
 * 
 * Copyright (c) 2022 Dasutein
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 * 
 * See more: https://github.com/ddasutein/AutoRename/blob/master/LICENSE
 * 
 */

const modal = document.querySelector(".modal");
const openModalBtn = document.getElementById("button_privacy_policy");
const closeModalBtn = document.getElementById("closeModalBtn")
const blurFilter = document.getElementById("blur")

openModalBtn.onclick = () => {
  modal.id = "show";
  blurFilter.classList.toggle("active");
}

closeModalBtn.onclick = () => {
  modal.id = 'hide';
  blurFilter.classList.remove("active");
}