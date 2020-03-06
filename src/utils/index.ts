/* eslint-disable */
export const getPrintContent = (innerHtml: string): string => `
<html moznomarginboxes>
  <head>
    <title>${document.title}</title>
    <style>
      @media print {
        @page { margin: 0; }
        body { margin: 0; padding: 0; }
      }
      .wrapperReceipt {
        padding: 16px;
        width: 240px;
        font-family: monospace;
      }

      .wrapperReceipt table {
        width: 100%;
        border: 0;
        table-layout: fixed;
        font-family: monospace;
      }

      .wrapperReceipt tbody {
        width: 100%;
        display: table-row-group;
        vertical-align: middle;
      }
      .wrapperReceipt .disc-font {
        font-size: 12px;
        font-style: italic;
      }
      p {
        font-size: 11px;
        margin-bottom: 0;
      }
      .right {
        text-align: right;
      }
    </style>
    <script language="javascript">
      document.addEventListener("DOMContentLoaded", function(){ 
        console.log("iFrame Loaded"); 
        window.print(); 
      })
    </script>
  </head>
  <body>
    ${innerHtml}
  </body>
</html>
`;
