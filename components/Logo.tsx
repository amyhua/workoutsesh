const Logo = ({
  size,
  className,
  onDark=true,
}: { size: number; className?: string; onDark?: boolean; }) => (
  <svg className={className} width={size} height="auto" viewBox="0 0 362 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.6975 32.0434H22.5779L20.5193 11.2104H20.3906L10.3117 32.0434H3.23504L0.575928 1.56867H8.12437L9.02504 22.0574H9.15371L18.5893 1.56867H25.9662L27.5959 22.0574H27.7246L36.7742 1.56867H44.2797L29.6975 32.0434ZM63.7372 0.793884C66.0246 0.793884 68.069 1.10954 69.8703 1.74084C71.7002 2.37214 73.2442 3.27606 74.5023 4.45258C75.7604 5.6291 76.7182 7.04954 77.3759 8.71388C78.0621 10.3782 78.4052 12.2291 78.4052 14.2665C78.4052 16.8491 77.962 19.2739 77.0757 21.5408C76.2179 23.7791 75.0027 25.7448 73.4301 27.4378C71.8575 29.1021 69.9704 30.4221 67.7688 31.3978C65.5957 32.3448 63.1939 32.8182 60.5634 32.8182C58.2474 32.8182 56.1745 32.5026 54.3445 31.8713C52.5146 31.24 50.9563 30.3361 49.6696 29.1595C48.4116 27.983 47.4394 26.5626 46.7532 24.8982C46.0956 23.2339 45.7668 21.383 45.7668 19.3456C45.7668 16.763 46.2099 14.3526 47.0963 12.1143C47.9827 9.84736 49.2265 7.88171 50.8276 6.21736C52.4288 4.52432 54.3159 3.20432 56.489 2.25736C58.6906 1.28171 61.1067 0.793884 63.7372 0.793884ZM60.9494 26.3617C62.522 26.3617 63.9231 26.0461 65.1525 25.4148C66.4106 24.7548 67.4685 23.8939 68.3263 22.8321C69.1841 21.7417 69.8417 20.5078 70.2992 19.1304C70.7567 17.7243 70.9854 16.2895 70.9854 14.8261C70.9854 13.7643 70.8139 12.7743 70.4708 11.8561C70.1276 10.9091 69.6273 10.0913 68.9697 9.40258C68.3406 8.71388 67.54 8.16867 66.5679 7.76693C65.5957 7.36519 64.4949 7.16432 63.2654 7.16432C61.7214 7.16432 60.3204 7.49432 59.0623 8.15432C57.8328 8.81432 56.7749 9.68954 55.8885 10.78C55.0308 11.8417 54.3588 13.0613 53.8728 14.4387C53.4153 15.8161 53.1865 17.2365 53.1865 18.7C53.1865 19.7617 53.3581 20.7661 53.7012 21.713C54.0443 22.6313 54.5447 23.4348 55.2023 24.1234C55.8599 24.8121 56.6605 25.3574 57.6041 25.7591C58.5762 26.1608 59.6914 26.3617 60.9494 26.3617ZM108.516 32.0434H100.452L95.3487 19.7761H92.4323L90.3736 32.0434H83.4256L88.7867 1.56867H99.1658C102.511 1.56867 105.113 2.28606 106.972 3.72084C108.859 5.12693 109.802 7.10693 109.802 9.66084C109.802 12.1287 109.13 14.1517 107.786 15.73C106.443 17.2795 104.627 18.3413 102.34 18.9152L108.516 32.0434ZM96.5496 14.6539C98.4653 14.6539 99.9521 14.3382 101.01 13.7069C102.068 13.0756 102.597 12.0713 102.597 10.6939C102.597 9.43127 102.154 8.57041 101.267 8.11128C100.381 7.65214 99.1944 7.42258 97.7076 7.42258H94.6625L93.3758 14.6539H96.5496ZM132.973 32.0434L124.181 17.71H124.052L121.565 32.0434H114.574L119.935 1.56867H126.926L124.653 14.3526H124.781L136.833 1.56867H145.925L131.043 16.0743L141.851 32.0434H132.973ZM164.595 0.793884C166.882 0.793884 168.927 1.10954 170.728 1.74084C172.558 2.37214 174.102 3.27606 175.36 4.45258C176.618 5.6291 177.576 7.04954 178.233 8.71388C178.92 10.3782 179.263 12.2291 179.263 14.2665C179.263 16.8491 178.82 19.2739 177.933 21.5408C177.075 23.7791 175.86 25.7448 174.288 27.4378C172.715 29.1021 170.828 30.4221 168.626 31.3978C166.453 32.3448 164.051 32.8182 161.421 32.8182C159.105 32.8182 157.032 32.5026 155.202 31.8713C153.372 31.24 151.814 30.3361 150.527 29.1595C149.269 27.983 148.297 26.5626 147.611 24.8982C146.953 23.2339 146.624 21.383 146.624 19.3456C146.624 16.763 147.067 14.3526 147.954 12.1143C148.84 9.84736 150.084 7.88171 151.685 6.21736C153.286 4.52432 155.173 3.20432 157.346 2.25736C159.548 1.28171 161.964 0.793884 164.595 0.793884ZM161.807 26.3617C163.38 26.3617 164.781 26.0461 166.01 25.4148C167.268 24.7548 168.326 23.8939 169.184 22.8321C170.042 21.7417 170.699 20.5078 171.157 19.1304C171.614 17.7243 171.843 16.2895 171.843 14.8261C171.843 13.7643 171.671 12.7743 171.328 11.8561C170.985 10.9091 170.485 10.0913 169.827 9.40258C169.198 8.71388 168.398 8.16867 167.425 7.76693C166.453 7.36519 165.352 7.16432 164.123 7.16432C162.579 7.16432 161.178 7.49432 159.92 8.15432C158.69 8.81432 157.632 9.68954 156.746 10.78C155.888 11.8417 155.216 13.0613 154.73 14.4387C154.273 15.8161 154.044 17.2365 154.044 18.7C154.044 19.7617 154.216 20.7661 154.559 21.713C154.902 22.6313 155.402 23.4348 156.06 24.1234C156.717 24.8121 157.518 25.3574 158.462 25.7591C159.434 26.1608 160.549 26.3617 161.807 26.3617ZM211.732 20.8521C211.417 22.66 210.903 24.31 210.188 25.8021C209.473 27.2656 208.53 28.5139 207.357 29.5469C206.214 30.58 204.841 31.3834 203.24 31.9574C201.639 32.5313 199.795 32.8182 197.707 32.8182C195.877 32.8182 194.219 32.5887 192.732 32.1295C191.274 31.6991 190.016 31.0821 188.958 30.2787C187.929 29.4465 187.128 28.4421 186.556 27.2656C186.013 26.0891 185.741 24.7691 185.741 23.3056C185.741 22.9039 185.756 22.4734 185.784 22.0143C185.841 21.5552 185.899 21.1104 185.956 20.68L189.301 1.56867H196.378L193.118 20.0343C193.061 20.3213 193.018 20.6226 192.99 20.9382C192.99 21.2539 192.99 21.5408 192.99 21.7991C192.99 22.4304 193.075 23.033 193.247 23.6069C193.447 24.1808 193.747 24.6974 194.148 25.1565C194.548 25.5869 195.077 25.9313 195.734 26.1895C196.392 26.4478 197.178 26.5769 198.093 26.5769C199.294 26.5769 200.281 26.3904 201.053 26.0174C201.853 25.6156 202.497 25.1134 202.983 24.5108C203.497 23.8795 203.883 23.1908 204.141 22.4448C204.398 21.67 204.598 20.8952 204.741 20.1204L208.044 1.56867H215.077L211.732 20.8521ZM235.462 7.72388L231.173 32.0434H224.054L228.299 7.72388H219.808L220.923 1.56867H244.854L243.782 7.72388H235.462Z"
      fill={onDark ? '#01FFA4' : '#000000'}
    />
    <path d="M265.088 8.97216C264.517 8.19738 263.802 7.60911 262.944 7.20738C262.086 6.80564 261.128 6.60477 260.07 6.60477C259.584 6.60477 259.07 6.67651 258.526 6.81998C257.983 6.93477 257.483 7.14998 257.025 7.46564C256.596 7.75259 256.225 8.12564 255.91 8.58477C255.624 9.0439 255.481 9.60346 255.481 10.2635C255.481 11.1243 255.81 11.813 256.468 12.3295C257.154 12.8174 258.098 13.2765 259.298 13.7069C260.614 14.1661 261.786 14.6826 262.815 15.2565C263.845 15.8017 264.717 16.433 265.431 17.1504C266.146 17.8678 266.69 18.6856 267.061 19.6039C267.433 20.4935 267.619 21.5122 267.619 22.66C267.619 24.4965 267.233 26.0604 266.461 27.3517C265.717 28.643 264.745 29.7048 263.544 30.5369C262.344 31.3404 261 31.9287 259.513 32.3017C258.026 32.6748 256.554 32.8613 255.095 32.8613C254.009 32.8613 252.922 32.7609 251.836 32.56C250.749 32.3591 249.706 32.0722 248.705 31.6991C247.704 31.2974 246.775 30.7952 245.917 30.1926C245.059 29.59 244.33 28.9013 243.73 28.1265L249.005 23.8222C249.606 24.7404 250.492 25.4865 251.664 26.0604C252.836 26.6343 254.023 26.9213 255.224 26.9213C255.853 26.9213 256.453 26.8639 257.025 26.7491C257.626 26.6056 258.155 26.3904 258.612 26.1035C259.07 25.7878 259.427 25.4004 259.684 24.9413C259.97 24.4535 260.113 23.8795 260.113 23.2195C260.113 22.1578 259.684 21.3256 258.827 20.723C257.969 20.0917 256.825 19.5322 255.396 19.0443C254.395 18.7 253.451 18.3126 252.565 17.8822C251.707 17.4517 250.949 16.9209 250.292 16.2895C249.663 15.6582 249.148 14.9122 248.748 14.0513C248.376 13.1617 248.19 12.1 248.19 10.8661C248.19 9.31651 248.505 7.92477 249.134 6.69085C249.791 5.42825 250.678 4.36651 251.793 3.50564C252.908 2.61607 254.209 1.94172 255.696 1.48259C257.183 0.994767 258.769 0.750854 260.456 0.750854C261.343 0.750854 262.243 0.836941 263.158 1.00911C264.073 1.18129 264.945 1.43955 265.775 1.7839C266.632 2.09955 267.419 2.50129 268.134 2.98911C268.848 3.47694 269.449 4.03651 269.935 4.66781L265.088 8.97216ZM273.707 32.0435L279.068 1.56868H298.496L297.424 7.68085H284.815L283.786 13.5778H295.794L294.765 19.3456H282.756L281.641 25.8882H295.451L294.379 32.0435H273.707ZM321.351 8.97216C320.78 8.19738 320.065 7.60911 319.207 7.20738C318.349 6.80564 317.391 6.60477 316.333 6.60477C315.847 6.60477 315.333 6.67651 314.789 6.81998C314.246 6.93477 313.746 7.14998 313.288 7.46564C312.859 7.75259 312.488 8.12564 312.173 8.58477C311.887 9.0439 311.744 9.60346 311.744 10.2635C311.744 11.1243 312.073 11.813 312.731 12.3295C313.417 12.8174 314.361 13.2765 315.561 13.7069C316.877 14.1661 318.049 14.6826 319.078 15.2565C320.108 15.8017 320.98 16.433 321.695 17.1504C322.409 17.8678 322.953 18.6856 323.324 19.6039C323.696 20.4935 323.882 21.5122 323.882 22.66C323.882 24.4965 323.496 26.0604 322.724 27.3517C321.98 28.643 321.008 29.7048 319.807 30.5369C318.607 31.3404 317.263 31.9287 315.776 32.3017C314.289 32.6748 312.817 32.8613 311.358 32.8613C310.272 32.8613 309.185 32.7609 308.099 32.56C307.012 32.3591 305.969 32.0722 304.968 31.6991C303.967 31.2974 303.038 30.7952 302.18 30.1926C301.322 29.59 300.593 28.9013 299.993 28.1265L305.268 23.8222C305.869 24.7404 306.755 25.4865 307.927 26.0604C309.1 26.6343 310.286 26.9213 311.487 26.9213C312.116 26.9213 312.717 26.8639 313.288 26.7491C313.889 26.6056 314.418 26.3904 314.875 26.1035C315.333 25.7878 315.69 25.4004 315.947 24.9413C316.233 24.4535 316.376 23.8795 316.376 23.2195C316.376 22.1578 315.947 21.3256 315.09 20.723C314.232 20.0917 313.088 19.5322 311.659 19.0443C310.658 18.7 309.714 18.3126 308.828 17.8822C307.97 17.4517 307.212 16.9209 306.555 16.2895C305.926 15.6582 305.411 14.9122 305.011 14.0513C304.639 13.1617 304.453 12.1 304.453 10.8661C304.453 9.31651 304.768 7.92477 305.397 6.69085C306.054 5.42825 306.941 4.36651 308.056 3.50564C309.171 2.61607 310.472 1.94172 311.959 1.48259C313.446 0.994767 315.033 0.750854 316.719 0.750854C317.606 0.750854 318.506 0.836941 319.421 1.00911C320.336 1.18129 321.209 1.43955 322.038 1.7839C322.895 2.09955 323.682 2.50129 324.397 2.98911C325.111 3.47694 325.712 4.03651 326.198 4.66781L321.351 8.97216ZM348.929 32.0435L351.159 19.2165H339.365L337.092 32.0435H329.972L335.333 1.56868H342.453L340.394 13.1474H352.231L354.247 1.56868H361.41L356.049 32.0435H348.929Z"
      fill={onDark ? '#ffffff' : '#acacac'}
    />
  </svg>
)

export default Logo