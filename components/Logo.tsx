const Logo = ({
  size,
  className,
  onDark=true,
}: { size: number; className?: string; onDark?: boolean; }) => (
  onDark ?
  <svg className={className} width={size} height="auto" viewBox="0 0 362 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.6975 32.0434H22.5779L20.5193 11.2104H20.3906L10.3117 32.0434H3.23504L0.575928 1.56867H8.12437L9.02504 22.0574H9.15371L18.5893 1.56867H25.9662L27.5959 22.0574H27.7246L36.7742 1.56867H44.2797L29.6975 32.0434ZM63.7372 0.793884C66.0246 0.793884 68.069 1.10954 69.8703 1.74084C71.7002 2.37214 73.2442 3.27606 74.5023 4.45258C75.7604 5.6291 76.7182 7.04954 77.3759 8.71388C78.0621 10.3782 78.4052 12.2291 78.4052 14.2665C78.4052 16.8491 77.962 19.2739 77.0757 21.5408C76.2179 23.7791 75.0027 25.7448 73.4301 27.4378C71.8575 29.1021 69.9704 30.4221 67.7688 31.3978C65.5957 32.3448 63.1939 32.8182 60.5634 32.8182C58.2474 32.8182 56.1745 32.5026 54.3445 31.8713C52.5146 31.24 50.9563 30.3361 49.6696 29.1595C48.4116 27.983 47.4394 26.5626 46.7532 24.8982C46.0956 23.2339 45.7668 21.383 45.7668 19.3456C45.7668 16.763 46.2099 14.3526 47.0963 12.1143C47.9827 9.84736 49.2265 7.88171 50.8276 6.21736C52.4288 4.52432 54.3159 3.20432 56.489 2.25736C58.6906 1.28171 61.1067 0.793884 63.7372 0.793884ZM60.9494 26.3617C62.522 26.3617 63.9231 26.0461 65.1525 25.4148C66.4106 24.7548 67.4685 23.8939 68.3263 22.8321C69.1841 21.7417 69.8417 20.5078 70.2992 19.1304C70.7567 17.7243 70.9854 16.2895 70.9854 14.8261C70.9854 13.7643 70.8139 12.7743 70.4708 11.8561C70.1276 10.9091 69.6273 10.0913 68.9697 9.40258C68.3406 8.71388 67.54 8.16867 66.5679 7.76693C65.5957 7.36519 64.4949 7.16432 63.2654 7.16432C61.7214 7.16432 60.3204 7.49432 59.0623 8.15432C57.8328 8.81432 56.7749 9.68954 55.8885 10.78C55.0308 11.8417 54.3588 13.0613 53.8728 14.4387C53.4153 15.8161 53.1865 17.2365 53.1865 18.7C53.1865 19.7617 53.3581 20.7661 53.7012 21.713C54.0443 22.6313 54.5447 23.4348 55.2023 24.1234C55.8599 24.8121 56.6605 25.3574 57.6041 25.7591C58.5762 26.1608 59.6914 26.3617 60.9494 26.3617ZM108.516 32.0434H100.452L95.3487 19.7761H92.4323L90.3736 32.0434H83.4256L88.7867 1.56867H99.1658C102.511 1.56867 105.113 2.28606 106.972 3.72084C108.859 5.12693 109.802 7.10693 109.802 9.66084C109.802 12.1287 109.13 14.1517 107.786 15.73C106.443 17.2795 104.627 18.3413 102.34 18.9152L108.516 32.0434ZM96.5496 14.6539C98.4653 14.6539 99.9521 14.3382 101.01 13.7069C102.068 13.0756 102.597 12.0713 102.597 10.6939C102.597 9.43127 102.154 8.57041 101.267 8.11128C100.381 7.65214 99.1944 7.42258 97.7076 7.42258H94.6625L93.3758 14.6539H96.5496ZM132.973 32.0434L124.181 17.71H124.052L121.565 32.0434H114.574L119.935 1.56867H126.926L124.653 14.3526H124.781L136.833 1.56867H145.925L131.043 16.0743L141.851 32.0434H132.973ZM164.595 0.793884C166.882 0.793884 168.927 1.10954 170.728 1.74084C172.558 2.37214 174.102 3.27606 175.36 4.45258C176.618 5.6291 177.576 7.04954 178.233 8.71388C178.92 10.3782 179.263 12.2291 179.263 14.2665C179.263 16.8491 178.82 19.2739 177.933 21.5408C177.075 23.7791 175.86 25.7448 174.288 27.4378C172.715 29.1021 170.828 30.4221 168.626 31.3978C166.453 32.3448 164.051 32.8182 161.421 32.8182C159.105 32.8182 157.032 32.5026 155.202 31.8713C153.372 31.24 151.814 30.3361 150.527 29.1595C149.269 27.983 148.297 26.5626 147.611 24.8982C146.953 23.2339 146.624 21.383 146.624 19.3456C146.624 16.763 147.067 14.3526 147.954 12.1143C148.84 9.84736 150.084 7.88171 151.685 6.21736C153.286 4.52432 155.173 3.20432 157.346 2.25736C159.548 1.28171 161.964 0.793884 164.595 0.793884ZM161.807 26.3617C163.38 26.3617 164.781 26.0461 166.01 25.4148C167.268 24.7548 168.326 23.8939 169.184 22.8321C170.042 21.7417 170.699 20.5078 171.157 19.1304C171.614 17.7243 171.843 16.2895 171.843 14.8261C171.843 13.7643 171.671 12.7743 171.328 11.8561C170.985 10.9091 170.485 10.0913 169.827 9.40258C169.198 8.71388 168.398 8.16867 167.425 7.76693C166.453 7.36519 165.352 7.16432 164.123 7.16432C162.579 7.16432 161.178 7.49432 159.92 8.15432C158.69 8.81432 157.632 9.68954 156.746 10.78C155.888 11.8417 155.216 13.0613 154.73 14.4387C154.273 15.8161 154.044 17.2365 154.044 18.7C154.044 19.7617 154.216 20.7661 154.559 21.713C154.902 22.6313 155.402 23.4348 156.06 24.1234C156.717 24.8121 157.518 25.3574 158.462 25.7591C159.434 26.1608 160.549 26.3617 161.807 26.3617ZM211.732 20.8521C211.417 22.66 210.903 24.31 210.188 25.8021C209.473 27.2656 208.53 28.5139 207.357 29.5469C206.214 30.58 204.841 31.3834 203.24 31.9574C201.639 32.5313 199.795 32.8182 197.707 32.8182C195.877 32.8182 194.219 32.5887 192.732 32.1295C191.274 31.6991 190.016 31.0821 188.958 30.2787C187.929 29.4465 187.128 28.4421 186.556 27.2656C186.013 26.0891 185.741 24.7691 185.741 23.3056C185.741 22.9039 185.756 22.4734 185.784 22.0143C185.841 21.5552 185.899 21.1104 185.956 20.68L189.301 1.56867H196.378L193.118 20.0343C193.061 20.3213 193.018 20.6226 192.99 20.9382C192.99 21.2539 192.99 21.5408 192.99 21.7991C192.99 22.4304 193.075 23.033 193.247 23.6069C193.447 24.1808 193.747 24.6974 194.148 25.1565C194.548 25.5869 195.077 25.9313 195.734 26.1895C196.392 26.4478 197.178 26.5769 198.093 26.5769C199.294 26.5769 200.281 26.3904 201.053 26.0174C201.853 25.6156 202.497 25.1134 202.983 24.5108C203.497 23.8795 203.883 23.1908 204.141 22.4448C204.398 21.67 204.598 20.8952 204.741 20.1204L208.044 1.56867H215.077L211.732 20.8521ZM235.462 7.72388L231.173 32.0434H224.054L228.299 7.72388H219.808L220.923 1.56867H244.854L243.782 7.72388H235.462Z"
      fill={onDark ? '#01FFA4' : '#000000'}
    />
    <path d="M265.088 8.97216C264.517 8.19738 263.802 7.60911 262.944 7.20738C262.086 6.80564 261.128 6.60477 260.07 6.60477C259.584 6.60477 259.07 6.67651 258.526 6.81998C257.983 6.93477 257.483 7.14998 257.025 7.46564C256.596 7.75259 256.225 8.12564 255.91 8.58477C255.624 9.0439 255.481 9.60346 255.481 10.2635C255.481 11.1243 255.81 11.813 256.468 12.3295C257.154 12.8174 258.098 13.2765 259.298 13.7069C260.614 14.1661 261.786 14.6826 262.815 15.2565C263.845 15.8017 264.717 16.433 265.431 17.1504C266.146 17.8678 266.69 18.6856 267.061 19.6039C267.433 20.4935 267.619 21.5122 267.619 22.66C267.619 24.4965 267.233 26.0604 266.461 27.3517C265.717 28.643 264.745 29.7048 263.544 30.5369C262.344 31.3404 261 31.9287 259.513 32.3017C258.026 32.6748 256.554 32.8613 255.095 32.8613C254.009 32.8613 252.922 32.7609 251.836 32.56C250.749 32.3591 249.706 32.0722 248.705 31.6991C247.704 31.2974 246.775 30.7952 245.917 30.1926C245.059 29.59 244.33 28.9013 243.73 28.1265L249.005 23.8222C249.606 24.7404 250.492 25.4865 251.664 26.0604C252.836 26.6343 254.023 26.9213 255.224 26.9213C255.853 26.9213 256.453 26.8639 257.025 26.7491C257.626 26.6056 258.155 26.3904 258.612 26.1035C259.07 25.7878 259.427 25.4004 259.684 24.9413C259.97 24.4535 260.113 23.8795 260.113 23.2195C260.113 22.1578 259.684 21.3256 258.827 20.723C257.969 20.0917 256.825 19.5322 255.396 19.0443C254.395 18.7 253.451 18.3126 252.565 17.8822C251.707 17.4517 250.949 16.9209 250.292 16.2895C249.663 15.6582 249.148 14.9122 248.748 14.0513C248.376 13.1617 248.19 12.1 248.19 10.8661C248.19 9.31651 248.505 7.92477 249.134 6.69085C249.791 5.42825 250.678 4.36651 251.793 3.50564C252.908 2.61607 254.209 1.94172 255.696 1.48259C257.183 0.994767 258.769 0.750854 260.456 0.750854C261.343 0.750854 262.243 0.836941 263.158 1.00911C264.073 1.18129 264.945 1.43955 265.775 1.7839C266.632 2.09955 267.419 2.50129 268.134 2.98911C268.848 3.47694 269.449 4.03651 269.935 4.66781L265.088 8.97216ZM273.707 32.0435L279.068 1.56868H298.496L297.424 7.68085H284.815L283.786 13.5778H295.794L294.765 19.3456H282.756L281.641 25.8882H295.451L294.379 32.0435H273.707ZM321.351 8.97216C320.78 8.19738 320.065 7.60911 319.207 7.20738C318.349 6.80564 317.391 6.60477 316.333 6.60477C315.847 6.60477 315.333 6.67651 314.789 6.81998C314.246 6.93477 313.746 7.14998 313.288 7.46564C312.859 7.75259 312.488 8.12564 312.173 8.58477C311.887 9.0439 311.744 9.60346 311.744 10.2635C311.744 11.1243 312.073 11.813 312.731 12.3295C313.417 12.8174 314.361 13.2765 315.561 13.7069C316.877 14.1661 318.049 14.6826 319.078 15.2565C320.108 15.8017 320.98 16.433 321.695 17.1504C322.409 17.8678 322.953 18.6856 323.324 19.6039C323.696 20.4935 323.882 21.5122 323.882 22.66C323.882 24.4965 323.496 26.0604 322.724 27.3517C321.98 28.643 321.008 29.7048 319.807 30.5369C318.607 31.3404 317.263 31.9287 315.776 32.3017C314.289 32.6748 312.817 32.8613 311.358 32.8613C310.272 32.8613 309.185 32.7609 308.099 32.56C307.012 32.3591 305.969 32.0722 304.968 31.6991C303.967 31.2974 303.038 30.7952 302.18 30.1926C301.322 29.59 300.593 28.9013 299.993 28.1265L305.268 23.8222C305.869 24.7404 306.755 25.4865 307.927 26.0604C309.1 26.6343 310.286 26.9213 311.487 26.9213C312.116 26.9213 312.717 26.8639 313.288 26.7491C313.889 26.6056 314.418 26.3904 314.875 26.1035C315.333 25.7878 315.69 25.4004 315.947 24.9413C316.233 24.4535 316.376 23.8795 316.376 23.2195C316.376 22.1578 315.947 21.3256 315.09 20.723C314.232 20.0917 313.088 19.5322 311.659 19.0443C310.658 18.7 309.714 18.3126 308.828 17.8822C307.97 17.4517 307.212 16.9209 306.555 16.2895C305.926 15.6582 305.411 14.9122 305.011 14.0513C304.639 13.1617 304.453 12.1 304.453 10.8661C304.453 9.31651 304.768 7.92477 305.397 6.69085C306.054 5.42825 306.941 4.36651 308.056 3.50564C309.171 2.61607 310.472 1.94172 311.959 1.48259C313.446 0.994767 315.033 0.750854 316.719 0.750854C317.606 0.750854 318.506 0.836941 319.421 1.00911C320.336 1.18129 321.209 1.43955 322.038 1.7839C322.895 2.09955 323.682 2.50129 324.397 2.98911C325.111 3.47694 325.712 4.03651 326.198 4.66781L321.351 8.97216ZM348.929 32.0435L351.159 19.2165H339.365L337.092 32.0435H329.972L335.333 1.56868H342.453L340.394 13.1474H352.231L354.247 1.56868H361.41L356.049 32.0435H348.929Z"
      fill={onDark ? '#ffffff' : '#01FFA4'}
    />
  </svg>
  :
  <svg className={className} width={size} height="auto" viewBox="0 0 386 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_74_352)">
      <path d="M386 0H0V55H386V0Z" fill="#090909"/>
      <path d="M41.6975 43.0434H34.5779L32.5193 22.2104H32.3906L22.3117 43.0434H15.235L12.5759 12.5687H20.1244L21.025 33.0574H21.1537L30.5893 12.5687H37.9662L39.5959 33.0574H39.7246L48.7742 12.5687H56.2797L41.6975 43.0434ZM75.7372 11.7939C78.0246 11.7939 80.069 12.1095 81.8703 12.7408C83.7002 13.3721 85.2442 14.2761 86.5023 15.4526C87.7604 16.6291 88.7182 18.0495 89.3759 19.7139C90.0621 21.3782 90.4052 23.2291 90.4052 25.2665C90.4052 27.8491 89.962 30.2739 89.0757 32.5408C88.2179 34.7791 87.0027 36.7448 85.4301 38.4378C83.8575 40.1021 81.9704 41.4221 79.7688 42.3978C77.5957 43.3448 75.1939 43.8182 72.5634 43.8182C70.2474 43.8182 68.1745 43.5026 66.3445 42.8713C64.5146 42.24 62.9563 41.3361 61.6696 40.1595C60.4116 38.983 59.4394 37.5626 58.7532 35.8982C58.0956 34.2339 57.7668 32.383 57.7668 30.3456C57.7668 27.763 58.2099 25.3526 59.0963 23.1143C59.9827 20.8474 61.2265 18.8817 62.8276 17.2174C64.4288 15.5243 66.3159 14.2043 68.489 13.2574C70.6906 12.2817 73.1067 11.7939 75.7372 11.7939ZM72.9494 37.3617C74.522 37.3617 75.9231 37.0461 77.1525 36.4148C78.4106 35.7548 79.4685 34.8939 80.3263 33.8321C81.1841 32.7417 81.8417 31.5078 82.2992 30.1304C82.7567 28.7243 82.9854 27.2895 82.9854 25.8261C82.9854 24.7643 82.8139 23.7743 82.4708 22.8561C82.1276 21.9091 81.6273 21.0913 80.9697 20.4026C80.3406 19.7139 79.54 19.1687 78.5679 18.7669C77.5957 18.3652 76.4949 18.1643 75.2654 18.1643C73.7214 18.1643 72.3204 18.4943 71.0623 19.1543C69.8328 19.8143 68.7749 20.6895 67.8885 21.78C67.0308 22.8417 66.3588 24.0613 65.8728 25.4387C65.4153 26.8161 65.1865 28.2365 65.1865 29.7C65.1865 30.7617 65.3581 31.7661 65.7012 32.713C66.0443 33.6313 66.5447 34.4348 67.2023 35.1234C67.8599 35.8121 68.6605 36.3574 69.6041 36.7591C70.5762 37.1608 71.6914 37.3617 72.9494 37.3617ZM120.516 43.0434H112.452L107.349 30.7761H104.432L102.374 43.0434H95.4256L100.787 12.5687H111.166C114.511 12.5687 117.113 13.2861 118.972 14.7208C120.859 16.1269 121.802 18.1069 121.802 20.6608C121.802 23.1287 121.13 25.1517 119.786 26.73C118.443 28.2795 116.627 29.3413 114.34 29.9152L120.516 43.0434ZM108.55 25.6539C110.465 25.6539 111.952 25.3382 113.01 24.7069C114.068 24.0756 114.597 23.0713 114.597 21.6939C114.597 20.4313 114.154 19.5704 113.267 19.1113C112.381 18.6521 111.194 18.4226 109.708 18.4226H106.662L105.376 25.6539H108.55ZM144.973 43.0434L136.181 28.71H136.052L133.565 43.0434H126.574L131.935 12.5687H138.926L136.653 25.3526H136.781L148.833 12.5687H157.925L143.043 27.0743L153.851 43.0434H144.973ZM176.595 11.7939C178.882 11.7939 180.927 12.1095 182.728 12.7408C184.558 13.3721 186.102 14.2761 187.36 15.4526C188.618 16.6291 189.576 18.0495 190.233 19.7139C190.92 21.3782 191.263 23.2291 191.263 25.2665C191.263 27.8491 190.82 30.2739 189.933 32.5408C189.075 34.7791 187.86 36.7448 186.288 38.4378C184.715 40.1021 182.828 41.4221 180.626 42.3978C178.453 43.3448 176.051 43.8182 173.421 43.8182C171.105 43.8182 169.032 43.5026 167.202 42.8713C165.372 42.24 163.814 41.3361 162.527 40.1595C161.269 38.983 160.297 37.5626 159.611 35.8982C158.953 34.2339 158.624 32.383 158.624 30.3456C158.624 27.763 159.067 25.3526 159.954 23.1143C160.84 20.8474 162.084 18.8817 163.685 17.2174C165.286 15.5243 167.173 14.2043 169.346 13.2574C171.548 12.2817 173.964 11.7939 176.595 11.7939ZM173.807 37.3617C175.38 37.3617 176.781 37.0461 178.01 36.4148C179.268 35.7548 180.326 34.8939 181.184 33.8321C182.042 32.7417 182.699 31.5078 183.157 30.1304C183.614 28.7243 183.843 27.2895 183.843 25.8261C183.843 24.7643 183.671 23.7743 183.328 22.8561C182.985 21.9091 182.485 21.0913 181.827 20.4026C181.198 19.7139 180.398 19.1687 179.425 18.7669C178.453 18.3652 177.352 18.1643 176.123 18.1643C174.579 18.1643 173.178 18.4943 171.92 19.1543C170.69 19.8143 169.632 20.6895 168.746 21.78C167.888 22.8417 167.216 24.0613 166.73 25.4387C166.273 26.8161 166.044 28.2365 166.044 29.7C166.044 30.7617 166.216 31.7661 166.559 32.713C166.902 33.6313 167.402 34.4348 168.06 35.1234C168.717 35.8121 169.518 36.3574 170.462 36.7591C171.434 37.1608 172.549 37.3617 173.807 37.3617ZM223.732 31.8521C223.417 33.66 222.903 35.31 222.188 36.8021C221.473 38.2656 220.53 39.5139 219.357 40.5469C218.214 41.58 216.841 42.3834 215.24 42.9574C213.639 43.5313 211.795 43.8182 209.707 43.8182C207.877 43.8182 206.219 43.5887 204.732 43.1295C203.274 42.6991 202.016 42.0821 200.958 41.2787C199.929 40.4465 199.128 39.4421 198.556 38.2656C198.013 37.0891 197.741 35.7691 197.741 34.3056C197.741 33.9039 197.756 33.4734 197.784 33.0143C197.841 32.5552 197.899 32.1104 197.956 31.68L201.301 12.5687H208.378L205.118 31.0343C205.061 31.3213 205.018 31.6226 204.99 31.9382C204.99 32.2539 204.99 32.5408 204.99 32.7991C204.99 33.4304 205.075 34.033 205.247 34.6069C205.447 35.1808 205.747 35.6974 206.148 36.1565C206.548 36.5869 207.077 36.9313 207.734 37.1895C208.392 37.4478 209.178 37.5769 210.093 37.5769C211.294 37.5769 212.281 37.3904 213.053 37.0174C213.853 36.6156 214.497 36.1134 214.983 35.5108C215.497 34.8795 215.883 34.1908 216.141 33.4448C216.398 32.67 216.598 31.8952 216.741 31.1204L220.044 12.5687H227.077L223.732 31.8521ZM247.462 18.7239L243.173 43.0434H236.054L240.299 18.7239H231.808L232.923 12.5687H256.854L255.782 18.7239H247.462Z" fill="#01FFA4"/>
      <path d="M277.088 19.9722C276.517 19.1974 275.802 18.6091 274.944 18.2074C274.086 17.8056 273.128 17.6048 272.07 17.6048C271.584 17.6048 271.07 17.6765 270.526 17.82C269.983 17.9348 269.483 18.15 269.025 18.4656C268.596 18.7526 268.225 19.1256 267.91 19.5848C267.624 20.0439 267.481 20.6035 267.481 21.2635C267.481 22.1243 267.81 22.813 268.468 23.3295C269.154 23.8174 270.098 24.2765 271.298 24.7069C272.614 25.1661 273.786 25.6826 274.815 26.2565C275.845 26.8017 276.717 27.433 277.431 28.1504C278.146 28.8678 278.69 29.6856 279.061 30.6039C279.433 31.4935 279.619 32.5122 279.619 33.66C279.619 35.4965 279.233 37.0604 278.461 38.3517C277.717 39.643 276.745 40.7048 275.544 41.5369C274.344 42.3404 273 42.9287 271.513 43.3017C270.026 43.6748 268.554 43.8613 267.095 43.8613C266.009 43.8613 264.922 43.7609 263.836 43.56C262.749 43.3591 261.706 43.0722 260.705 42.6991C259.704 42.2974 258.775 41.7952 257.917 41.1926C257.059 40.59 256.33 39.9013 255.73 39.1265L261.005 34.8222C261.606 35.7404 262.492 36.4865 263.664 37.0604C264.836 37.6343 266.023 37.9213 267.224 37.9213C267.853 37.9213 268.453 37.8639 269.025 37.7491C269.626 37.6056 270.155 37.3904 270.612 37.1035C271.07 36.7878 271.427 36.4004 271.684 35.9413C271.97 35.4535 272.113 34.8795 272.113 34.2195C272.113 33.1578 271.684 32.3256 270.827 31.723C269.969 31.0917 268.825 30.5322 267.396 30.0443C266.395 29.7 265.451 29.3126 264.565 28.8822C263.707 28.4517 262.949 27.9209 262.292 27.2895C261.663 26.6582 261.148 25.9122 260.748 25.0513C260.376 24.1617 260.19 23.1 260.19 21.8661C260.19 20.3165 260.505 18.9248 261.134 17.6909C261.791 16.4282 262.678 15.3665 263.793 14.5056C264.908 13.6161 266.209 12.9417 267.696 12.4826C269.183 11.9948 270.769 11.7509 272.456 11.7509C273.343 11.7509 274.243 11.8369 275.158 12.0091C276.073 12.1813 276.945 12.4396 277.775 12.7839C278.632 13.0996 279.419 13.5013 280.134 13.9891C280.848 14.4769 281.449 15.0365 281.935 15.6678L277.088 19.9722ZM285.707 43.0435L291.068 12.5687H310.496L309.424 18.6809H296.815L295.786 24.5778H307.794L306.765 30.3456H294.756L293.641 36.8882H307.451L306.379 43.0435H285.707ZM333.351 19.9722C332.78 19.1974 332.065 18.6091 331.207 18.2074C330.349 17.8056 329.391 17.6048 328.333 17.6048C327.847 17.6048 327.333 17.6765 326.789 17.82C326.246 17.9348 325.746 18.15 325.288 18.4656C324.859 18.7526 324.488 19.1256 324.173 19.5848C323.887 20.0439 323.744 20.6035 323.744 21.2635C323.744 22.1243 324.073 22.813 324.731 23.3295C325.417 23.8174 326.361 24.2765 327.561 24.7069C328.877 25.1661 330.049 25.6826 331.078 26.2565C332.108 26.8017 332.98 27.433 333.695 28.1504C334.409 28.8678 334.953 29.6856 335.324 30.6039C335.696 31.4935 335.882 32.5122 335.882 33.66C335.882 35.4965 335.496 37.0604 334.724 38.3517C333.98 39.643 333.008 40.7048 331.807 41.5369C330.607 42.3404 329.263 42.9287 327.776 43.3017C326.289 43.6748 324.817 43.8613 323.358 43.8613C322.272 43.8613 321.185 43.7609 320.099 43.56C319.012 43.3591 317.969 43.0722 316.968 42.6991C315.967 42.2974 315.038 41.7952 314.18 41.1926C313.322 40.59 312.593 39.9013 311.993 39.1265L317.268 34.8222C317.869 35.7404 318.755 36.4865 319.927 37.0604C321.1 37.6343 322.286 37.9213 323.487 37.9213C324.116 37.9213 324.717 37.8639 325.288 37.7491C325.889 37.6056 326.418 37.3904 326.875 37.1035C327.333 36.7878 327.69 36.4004 327.947 35.9413C328.233 35.4535 328.376 34.8795 328.376 34.2195C328.376 33.1578 327.947 32.3256 327.09 31.723C326.232 31.0917 325.088 30.5322 323.659 30.0443C322.658 29.7 321.714 29.3126 320.828 28.8822C319.97 28.4517 319.212 27.9209 318.555 27.2895C317.926 26.6582 317.411 25.9122 317.011 25.0513C316.639 24.1617 316.453 23.1 316.453 21.8661C316.453 20.3165 316.768 18.9248 317.397 17.6909C318.054 16.4282 318.941 15.3665 320.056 14.5056C321.171 13.6161 322.472 12.9417 323.959 12.4826C325.446 11.9948 327.033 11.7509 328.719 11.7509C329.606 11.7509 330.506 11.8369 331.421 12.0091C332.336 12.1813 333.209 12.4396 334.038 12.7839C334.895 13.0996 335.682 13.5013 336.397 13.9891C337.111 14.4769 337.712 15.0365 338.198 15.6678L333.351 19.9722ZM360.929 43.0435L363.159 30.2165H351.365L349.092 43.0435H341.972L347.333 12.5687H354.453L352.394 24.1474H364.231L366.247 12.5687H373.41L368.049 43.0435H360.929Z" fill="#F5BCDB"/>
    </g>
    <defs>
      <clipPath id="clip0_74_352">
        <rect width="386" height="55" fill="white"/>
      </clipPath>
    </defs>
  </svg>

)

export default Logo
