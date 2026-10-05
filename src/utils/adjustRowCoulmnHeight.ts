export const adjustContentWithRowHeight = () => {
    if(document.querySelector('.getParent')){
      const childElements = document.querySelectorAll('.getParent');
      
      childElements.forEach((element: HTMLElement, index: number) => {
        if(element.querySelectorAll('.eq-height').length > 1){
          const childElements = element.querySelectorAll('.eq-height');
          // calculate the height, remove padding 16px (top & bottom), 1px border & remove each item margin
          const individualHeight = (element.offsetHeight - 17 - ((childElements.length - 1)* 10)) / childElements.length;
          
          childElements.forEach((childElement: HTMLElement) => {
            childElement.style.minHeight = `${individualHeight}px`;
          })
        }
      })
    }
  }

  // Use case
  // 1. add "getParent" this class name to slot in tableColumnList
  // 2. add .eq-height which item you want to adjust height
  // 3. add .eq-height css
  // .eq-height{
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   width: 100%;
  // }

  // onMounted(() => {
  //   adjustContentWithRowHeight();
  // })
  
  // onUpdated (() => {
  //   adjustContentWithRowHeight();
  // })
  