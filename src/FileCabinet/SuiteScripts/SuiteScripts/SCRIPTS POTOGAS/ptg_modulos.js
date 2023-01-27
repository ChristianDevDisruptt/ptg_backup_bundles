/**
 *@NApiVersion 2.1 
 *@Author Jorge Macias
 *@description funciones reutilisables para las busquedas gaurdadas de oportunidades
 */

define(["N/search", "N/log", "N/record", "SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors", "N/format", "N/search", "N/https"],
  /**
   * 
   * @param {import('N/search')} search 
   * @param {import('N/log')} log 
   * @param {import('N/record')} record 
   * @param {import('N/error')} error 
   * @param {import('N/format')} format 
   * @param {import('N/search')} search 
   * @param {import('N/https')} https 
   * @returns 
   */
  function (search, log, record, error, format, search, https) {
    /** Función que obtine los servicios de la fecha actual
     * @param {*} salesRepId
     * @param {object[]} resultArray
     * @param {*} responseData
     */
    function getTodayService(salesRepId, resultArray, responseData) {
      // try catch para capturar el error
      try {
        // se resive el id representante de venta y se pasa a decimal
        var salesRepId = parseInt(salesRepId, 10);
        // si no existe el representante de venta muestra un error
        // para mmayor informacion de errores ver el modulo : ptg_module_errors.js
        if (!salesRepId) {
          responseData.apiErrorGet.push(error.errorOnlyDate());
        }

        log.debug({
          title: "salesRepId",
          details: salesRepId
        });

        try {
          // se carga la busqueda guardada
          let searchOport = search.create({
            type: "transaction",
            filters: [
              ["type", "anyof", "Opprtnty"], "AND",
              ["salesrep", "anyof", salesRepId], "AND",
              ["trandate", "within", "today"], "AND",
              ["shipping", "is", "F"], "AND",
              ["taxline", "is", "F"], "AND",
              ["cogs", "is", "F"]
            ],
            columns: [
              "trandate",
              "closedate",
              "expectedclosedate",
              "bidclosedate",
              "entity",
              "entitystatus",
              "title",
              "salesrep",
              "custbody_ptg_hora_cierre",
              "custbody_hour",
              "shipaddress",
              "custbody_otg_folio_aut",
              "custbody_ptg_reference",
              "custbody_route",
              "custbody_ptg_turn",
              "custbody_ptg_opcion_pago",
              "custbody_ptg_numero_viaje",
              "billaddress",
              "item",
              search.createColumn({
                name: "salesdescription",
                join: "item"
              }),
              "quantity",
              "unit",
              "rate",
              "total",
              "amount",
              "line"
            ]
          });

          /**
           * , "AND", 
              ["status","anyof","Opprtnty:C"]
           */

          // filtrar por representante de venta
          /*  let salesRepFilter = search.createFilter({ name: "salesrep", operator: search.Operator.ANYOF, values: salesRepId });
           searchOport.filters.push(salesRepFilter); */

          //Filtro por fecha actual
          log.audit({
            title: "searchOport",
            details: searchOport
          })

          // se corre la busqueda guarda , almacennado la informacion actualizada en una variable
          var resultSet = searchOport.run();

        } catch (error) {
          log.debug({
            title: "ERR-001: configuración invalida",
            details: error.message
          });
          responseData.apiErrorGet.push(error.errorSearch());
        }

        // se realiza el mapeo de la busqueda por id
        var count = 0;
        resultSet.each((results) => {
          count = count + 1

          let internalId = results.id;
          //let closeDateReal = results.getValue({ name: "closedate" });
          // se carga el registro de oportunidad por el id de la oportunidad
          //var opportRecord = record.load({ type: record.Type.OPPORTUNITY, id: internalId, isDynamic: true });
          // se obtiene cada valor de registro de la oportunidad

          if (results.getValue({
            name: "line"
          }) == "0") {
            let status = results.getValue({
              name: "entitystatus"
            });
            let dateCreateFormat = results.getValue({
              name: "trandate"
            });
            let closeDateFormat = results.getValue({
              name: "expectedclosedate"
            });
            let customer = results.getValue({
              name: "entity"
            });
            let customerName = results.getText({
              name: "entity"
            });
            let operario = results.getValue({
              name: "salesrep"
            });
            let hourFormat = results.getValue({
              name: "custbody_hour"
            });
            let address = results.getValue({
              name: "billaddress"
            });
            let route = results.getValue({
              name: "custbody_route"
            });
            let turn = results.getValue({
              name: "custbody_ptg_turn"
            });
            let paymentMethod = results.getValue({
              name: "custbody_ptg_opcion_pago"
            });
            let numViaje = results.getValue({
              name: "custbody_ptg_numero_viaje"
            });
            let folio = results.getValue({
              name: "custbody_otg_folio_aut"
            });
            let reference = results.getValue({
              name: "custbody_ptg_reference"
            });

            var closeDate = formatDate(closeDateFormat);
            var dateCreate = formatDate(dateCreateFormat);
            var hour = formatTime(hourFormat);

            resultArray.push({
              id: results.id,
              status,
              dateCreateFormat,
              closeDateFormat,
              customer,
              customerName,
              operario,
              hourFormat,
              address,
              route,
              turn,
              paymentMethod,
              numViaje,
              folio,
              reference,
              items: []
            })

          } else if (results.id == resultArray[resultArray.length - 1].id) {
            var article = results.getValue({
              name: "item"
            });
            var articleText = (results.getValue({
              name: "salesdescription",
              join: "item"
            })).trim();
            var quantity = results.getValue({
              name: "quantity"
            });
            var units = results.getValue({
              name: "unit"
            });
            var price = results.getValue({
              name: "rate"
            });
            var amount = results.getValue({
              name: "amount"
            });
            var importTotal = results.getValue({
              name: "total"
            });
            var line = results.getValue({
              name: "line"
            });

            resultArray[resultArray.length - 1].items.push({
              article,
              articleText,
              quantity,
              units,
              price,
              amount,
              importTotal
            })
          }

          return true;
        });
        log.debug({
          title: "count",
          details: count
        })

        responseData.data = resultArray; // pisamos la data de nuestra estructura de datos
        return true;
      } catch (err) {
        responseData.apiErrorGet.push(error.errorNotParameter(err.message)); // error multifuncional caprutado por el catch
      }
    }
    // fin de la funcion getTodayService(

    function formatDate(date) {
      if (!date || !(date instanceof Date)) return typeof date == 'string' ? date : ""
      var day = date.getDate();
      var mounth = date.getMonth() + 1;
      var year = date.getFullYear();

      var newDate =
        day.toString() + "/" + mounth.toString() + "/" + year.toString();

      return newDate;
    }

    function formatTime(time) {
      if (!time || !(time instanceof Date)) return typeof date == 'string' ? date : ""
      var hour = time.getHours();
      var minute = time.getMinutes();

      var newTime = hour.toString() + ":" + minute.toString();

      return newTime;
    }

    function horaMilitar() {
      var url = "https://4570554.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=476&deploy=1&compid=4570554&h=9e70f74fe1cb89dbc930";
      var headers = {
        "Accept": "application/json"
      };
      var response = https.get({
        url: url,
        headers: headers
      });
      log.debug({
        title: "response",
        details: response
      })
      respuesta = JSON.parse(response.body);

      return respuesta.data.militaryTime;
    }

    function createItem(opportunityRecord, items, tipoArticulo) {
      log.debug({
        title: "items",
        details: items,
      });
      // se recorre el items pasado por body
      items.forEach((item) => {
        // opportunityRecord.selectNewLine({
        //   //selecciona una nueva linea para cada iteración
        //   sublistId: "item",
        // });
        log.debug('items', item.tipo)
        var precioZona = item.zoneprice;
        var capacidad = item.capacity;
        var total = precioZona * capacidad;

        if (item.tipo == 2) {
          opportunityRecord.selectNewLine({
            //selecciona una nueva linea para cada iteración
            sublistId: "item",
          });

          opportunityRecord.setCurrentSublistValue({
            // Articulo a vender
            sublistId: "item",
            fieldId: "item",
            value: item.article,
          });

          opportunityRecord.setCurrentSublistValue({
            // cantidad del producto de la oportunidad
            sublistId: "item",
            fieldId: "quantity",
            value: item.capacity,
          });
          //[{"article":"5514","quantity":5,"capacity":10,"zoneprice":"225"}]
          var cantidad = item.quantity

          opportunityRecord.setCurrentSublistValue({
            // importe del producto de la oportunidad
            sublistId: "item",
            fieldId: "rate",
            value: precioZona,
          });

          opportunityRecord.commitLine({
            sublistId: "item",
          });
        } else if (item.tipo == 1) {
          opportunityRecord.selectNewLine({
            //selecciona una nueva linea para cada iteración
            sublistId: "item",
          });

          opportunityRecord.setCurrentSublistValue({
            // Articulo a vender
            sublistId: "item",
            fieldId: "item",
            value: item.article,
          });

          opportunityRecord.setCurrentSublistValue({
            // cantidad del producto de la oportunidad
            sublistId: "item",
            fieldId: "quantity",
            value: item.quantity,
          });
          //[{"article":"5514","quantity":5,"capacity":10,"zoneprice":"225"}]
          var cantidad = item.quantity
          var precioZona = item.zoneprice;
          var capacidad = item.capacity;
          var total = precioZona * capacidad;
          log.audit('total', total);

          opportunityRecord.setCurrentSublistValue({
            // importe del producto de la oportunidad
            sublistId: "item",
            fieldId: "rate",
            value: total,
          });

          opportunityRecord.commitLine({
            sublistId: "item",
          });
        } else if (item.tipo == 5) {
          opportunityRecord.selectNewLine({
            //selecciona una nueva linea para cada iteración
            sublistId: "item",
          });

          opportunityRecord.setCurrentSublistValue({
            sublistId: "item",
            fieldId: "item",
            value: item.article,
          });

          opportunityRecord.setCurrentSublistValue({
            sublistId: "item",
            fieldId: "quantity",
            value: item.quantity,
          });

          opportunityRecord.setCurrentSublistValue({
            sublistId: "item",
            fieldId: "rate",
            value: Number(item.precio),
          });

          // opportunityRecord.setCurrentSublistValue({            
          //   sublistId: "item",
          //   fieldId: "rate",
          //   value: (item.precio * item.quantity),
          // });
          opportunityRecord.commitLine({
            sublistId: "item",
          });

        } else if (item.tipo == 4 && item.precio < 0) {
          opportunityRecord.selectNewLine({
            //selecciona una nueva linea para cada iteración
            sublistId: "item",
          });
          //Este tipo de articulo es unicamente para el descuento
          opportunityRecord.setCurrentSublistValue({
            sublistId: "item",
            fieldId: "item",
            value: item.article,
          });

          // opportunityRecord.setCurrentSublistValue({            
          //   sublistId: "item",
          //   fieldId: "quantity",
          //   value: item.quantity,
          // });

          opportunityRecord.setCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'price',
            value: -1
          });

          opportunityRecord.setCurrentSublistValue({
            sublistId: "item",
            fieldId: "rate",
            value: Number(item.precio) / 1.16
          });          

          opportunityRecord.commitLine({
            sublistId: "item",
          });

        }

        // let idArticle = opportunityRecord.commitLine({
        //   sublistId: "item",
        // });

        // log.debug({
        //   title: "idArticle",
        //   details: idArticle,
        // });
      });
    }

    function modifItem(opportRecord, request) {
      // se guarda en una variable el tamaño de la lista de items
      var itemsLength = opportRecord.getLineCount({
        sublistId: "item"
      });
      log.audit({
        title: "opportRecord",
        details: opportRecord
      });

      var itemsV = request.items;
      var itemsLength1 = itemsV.length
      var items = [];
      var posicionItem = [];
      // se recorre la lista dependiendo del tamaño de ella
      // el primer for recorre los items que vamos a modificar
      for (var elem = 0; elem < itemsLength1; elem++) {
        // el segundo for tiene en cuenta los items que fueron creados

        for (var elem1 = 0; elem1 < itemsLength; elem1++) {

          // seleccionamos la linea de la sublista que vamos modificar, tener en cuenta
          // que esta debe ser la lista de items creadas
          opportRecord.selectLine({
            sublistId: "item",
            line: elem1
          }); // se selecciona la lista de articulos
          // en este caso evaluamos si en la lista de items tenemos un articulo

          if (opportRecord.getCurrentSublistValue({
            sublistId: "item",
            fieldId: "item"
          }) == itemsV[elem].article) {
            opportRecord.setCurrentSublistValue({
              sublistId: "item",
              fieldId: "quantity",
              value: itemsV[elem].quantity
            }); // si es sí, setemos el valor quantity con el nuevo valor
            items.push({
              article: itemsV[elem].article,
              quantity: itemsV[elem].quantity
            }); // por ultimo pusheamos los nuevos datos modificados
            posicionItem.push(elem)
            opportRecord.commitLine({
              sublistId: "item"
            }); // se realiza el commitLine para dar por finalizado este proceso
          }
        }
      }

      log.audit('posicionItem', posicionItem)
      for (var x = 0; x < posicionItem.length; x++) {
        log.audit('x', posicionItem[x])
        if (x == 0) {
          itemsV.splice(posicionItem[x], 1)
        } else {
          log.audit('y', posicionItem[x] - 1)
          itemsV.splice(posicionItem[x] - x, 1)
        }
      }

      for (var x = 0; x < itemsV.length; x++) {
        opportRecord.selectNewLine({
          sublistId: 'item'
        })
        opportRecord.setCurrentSublistValue({
          sublistId: "item",
          fieldId: "item",
          value: itemsV[x].article
        });
        opportRecord.setCurrentSublistValue({
          sublistId: "item",
          fieldId: "quantity",
          value: itemsV[x].quantity
        });
        items.push({
          article: itemsV[x].article,
          quantity: itemsV[x].quantity
        });
        opportRecord.commitLine({
          sublistId: "item"
        });
      }

      log.audit('itemsV', itemsV)
      // retornamos los resultados de los nuevos datos modificados
      return items;

    }

    function createOrder(request, responseData) {
      idOpport = request.idOpport;
      // se obtiene los campos de la oportunidad que vamos a necesitar para el tranform
      let opportSearch = search.lookupFields({
        type: search.Type.OPPORTUNITY,
        id: idOpport,
        columns: [
          "entitystatus",
          "entity",
          "trandate",
          "expectedclosedate",
          "title",
          "tranid",
          "salesrep",
          "custbody_hour",
          "custbody_route",
          "custbody_ptg_turn",
          "custbody_ptg_opcion_pago",
        ],
      });

      log.debug({
        title: "opportSearch",
        details: opportSearch,
      });

      let orderList = [];

      try {
        // se procede a realizar la transformacion de oportunidad a orden de venta
        var orderRecord = record.transform({
          fromType: record.Type.OPPORTUNITY,
          fromId: idOpport,
          toType: record.Type.SALES_ORDER,
          isDynamic: true,
        });
        // se setea por default el estado de la orden como "Ejecución del pedido pendiente"
        orderRecord.setValue({
          // Estados de orden ==> A = Aprobación pendiente, B = Ejecución del pedido pendiente
          fieldId: "orderstatus",
          value: "B",
        });
        // se le dá formato a la fecha
        var date = format.parse({
          value: opportSearch.expectedclosedate,
          type: format.Type.DATE,
        });

        orderRecord.setValue({
          // fecha de orden de venta
          fieldId: "trandate",
          value: date,
        });

        orderRecord.setValue({
          // id del cliente
          fieldId: "entity",
          value: opportSearch.entity[0].value,
        });

        var time = format.parse({
          value: opportSearch.custbody_hour,
          type: format.Type.TIMEOFDAY,
        });

        orderRecord.setValue({
          // hora de la opotunidad
          fieldId: "custbody_hour",
          value: time,
        });

        orderRecord.setValue({
          //  opotunidad
          fieldId: "opportunity",
          value: idOpport,
        });

        orderRecord.setValue({
          // representante de venta o empleado
          fieldId: "salesrep",
          value: opportSearch.salesrep[0].value,
        });

        orderRecord.setValue({
          // Ruta del servicio
          fieldId: "custbody_route",
          value: opportSearch.custbody_route[0].value,
        });

        orderRecord.setValue({
          // turno de la oportunidad
          fieldId: "custbody_ptg_turn",
          value: opportSearch.custbody_ptg_turn[0].value,
        });

        orderRecord.setValue({
          // opción de pago : 1 = Efectivo, 2 = Bono, 3 = Vale
          fieldId: "custbody_ptg_opcion_pago",
          value: opportSearch.custbody_ptg_opcion_pago[0].value,
        });

        let items = opportSearch.item;
        // recorremos la lista de los articulos
        items &&
          items.forEach((item) => {
            let article = item.article;
            let quantity = item.quantity;
            let price = item.price;
            let units = item.units;

            orderRecord.selectNewLine({
              sublistId: "item",
            });
            // id del articulo
            orderRecord.setCurrentSublistValue({
              sublistId: "item",
              fieldId: "item",
              value: article,
            });
            // cantidad del articulo
            orderRecord.setCurrentSublistValue({
              sublistId: "item",
              fieldId: "quantity",
              value: quantity,
            });
            // precio base del articulo
            orderRecord.setCurrentSublistValue({
              sublistId: "item",
              fieldId: "price",
              value: price,
            });
            // unidades de los articulos : 1 = Pieza, 2 = Servicios, 3 = Kit, 4 = Kg
            orderRecord.setCurrentSublistValue({
              sublistId: "item",
              fieldId: "units",
              value: units,
            });

            orderRecord.commitLine({
              sublistId: "item",
            });
          });

        let orderId = orderRecord.save();
        // se pushea todos los id de las ordenes
        orderList.push(orderId);

        if (orderId) {
          responseData.isSuccessful = true;
          responseData.message = "Order created successfully";
          responseData.data = orderList;
        }
      } catch (err) {
        responseData.apiErrorPost.push(error.errorNotParameter(err.message));
      }
      // retornamos la orden creada
      return responseData;
    }

    function modifOpportunity(request, responseData) {
      log.debug({
        title: "Request Mod Oport",
        details: request
      });

      let opportunityList = [];
      try {
        // se recorreo la oportunidad ingresada por request para setear información

        var opportRecord = record.load({
          type: record.Type.OPPORTUNITY,
          id: request.idOpport,
          isDynamic: true
        });
        log.debug("RECORD", opportRecord);

        opportRecord.setValue({
          fieldId: "custbody_ptg_opcion_pago",
          value: request.paymentMethod
        }); // Unidades del artículo de una oportunidad
        opportRecord.setValue({
          fieldId: "entitystatus",
          value: "10"
        });
        // var itemsValues = modifItem(opportRecord, request);

        let itemCount = opportRecord.getLineCount({
          sublistId: "item"
        });
        log.debug("FIRST LINE COUNT", itemCount);

        //#region add

        /** @type {{ item:string, quantity: number }[]:object[]} */
        let itemsSublist = [];
        for (let ix = 0; ix < itemCount; ix++) {
          itemsSublist.push({
            item: opportRecord.getSublistValue({
              sublistId: "item",
              fieldId: "item",
              line: ix
            }),
            quantity: opportRecord.getSublistValue({
              sublistId: "item",
              fieldId: "quantity",
              line: ix
            }),
            oline: ix
          });
        }
        itemsSublist.sort((a, b) => (+a.item) - (+b.item));

        let itmSublist = itemsSublist.map(x => x.item);
        let requestxitems2 = JSON.parse(JSON.stringify(request.items));
        requestxitems2.sort((a, b) => (+a.article) - (+b.article));
        let addList = []
        requestxitems2.reverse().forEach((x, ix, ax) => {
          let found = itmSublist.lastIndexOf(x.article);

          if (found == -1) {
            addList.push(x);
          } else {
            itmSublist.splice(found, 1);
          }

        });

        log.debug("item to Add", addList)
        addList.forEach((x, ix, ax) => {
          opportRecord.selectNewLine({
            sublistId: "item"
          })
          opportRecord.setCurrentSublistValue({
            sublistId: "item",
            fieldId: "item",
            value: x.article
          })
          opportRecord.setCurrentSublistValue({
            sublistId: "item",
            fieldId: "quantity",
            value: x.quantity
          })
          opportRecord.commitLine({
            sublistId: "item"
          });
        })

        //#endregion

        //#region 

        //remove
        /** @type {{article : string, quantity: number }[] : object[] } */
        let requestxitems = JSON.parse(JSON.stringify(request.items));
        requestxitems.sort((a, b) => (+a.article) - (+b.article));
        let requestxitemsIds = requestxitems.map(x => x.article);

        // let foundList = [];

        itemsSublist = [];
        itemCount = opportRecord.getLineCount({
          sublistId: "item"
        });
        for (let ix = 0; ix < itemCount; ix++) {
          itemsSublist.push({
            item: opportRecord.getSublistValue({
              sublistId: "item",
              fieldId: "item",
              line: ix
            }),
            quantity: opportRecord.getSublistValue({
              sublistId: "item",
              fieldId: "quantity",
              line: ix
            }),
            oline: ix
          });
        }

        itemsSublist.sort((a, b) => +(a.item) - +(b.item));
        log.debug("SUBLIST", itemsSublist);

        itemsSublist.reverse().forEach((x, ix, ax) => {
          log.debug("REQUEST ITEMS", requestxitemsIds);
          let found = requestxitemsIds.lastIndexOf(x.item);
          if (found != -1) {
            ax[ix]["sIndex"] = found;
            ax[ix]["sQuantity"] = requestxitems[found].quantity;
            // foundList.push(found);
            requestxitemsIds.splice(found, 1);
          }
        });

        // Invierte el arreglo y elimina en la sublista filtrando.
        log.debug("itemsSublist", itemsSublist);
        itemsSublist.forEach((x, i, a) => {
          let indx = (a.length - 1) - i;

          if (x.hasOwnProperty("sIndex")) {
            opportRecord.selectLine({
              sublistId: "item",
              line: x.oline
            })
            opportRecord.setCurrentSublistValue({
              sublistId: "item",
              fieldId: "quantity",
              value: x.sQuantity
            })
            opportRecord.commitLine({
              sublistId: "item"
            });
          }

        });

        itemsSublist
          .filter(x => !x.hasOwnProperty("sIndex"))
          .sort((a, b) => a.oline - b.oline)
          .reverse()
          .forEach(x => {
            opportRecord.removeLine({
              sublistId: "item",
              line: x.oline
            })
          })

        log.debug("itemsSublist2", itemsSublist);

        //#endregion

        let itemsValues = itemsSublist;



        log.debug({
          title: "ya paso por la funcion",
          details: "ya paso ..."
        })
        // se guarda el registro en la base de datos
        let opportunityId = opportRecord.save();
        // pusheamos el id de oportunidad creada
        opportunityList.push(opportunityId);

        // si el id de oportunidad existe se modifica mensaje de successfully
        if (opportunityId) {
          responseData.isSuccessful = true;
          responseData.message = "Opportunity modified successfully";
          responseData.data = {
            opportunityList,
            itemsValues
          };
        }

        log.debug({
          title: "opportunityList",
          details: opportunityList
        });
        // se captura el error
      } catch (err) {
        log.debug({
          title: "Error",
          details: err
        });
        responseData.apiErrorPost.push(error.errorNotParameter(err.message)); //errorNotParameter
      }
      // regresamos el response creado
      return responseData;
    }

    function changeStatusOpportunity(request, responseData, status) {
      try {
        // se carga la oportunidad con el id pasado por request
        var opportRecord = record.load({
          type: record.Type.OPPORTUNITY,
          id: request.idOpport,
          isDynamic: true
        });
        // se modifica el estado por el valor pasado por request
        opportRecord.setValue({
          fieldId: "entitystatus",
          value: status
        });
        // se modifica la descripción por el valor pasado por request
        opportRecord.setValue({
          fieldId: "memo",
          value: request.description
        });

        var newDate = new Date();
        var date = formatDate(newDate);

        opportRecord.setValue({
          fieldId: "closedate",
          value: date
        });

        var time = format.parse({
          value: horaMilitar(),
          type: format.Type.TIMEOFDAY
        })

        opportRecord.setValue({
          fieldId: "custbody_ptg_hora_cierre",
          value: time
        });

        // se validan los estados, 14 = cancelar , 15  = reprogramar
        if (status == "14") {
          opportRecord.setValue({
            fieldId: "custbody_ptg_motivo_cancelation",
            value: request.idMotivo
          });
        }

        if (status == "11") {
          opportRecord.setValue({
            fieldId: "custbody_ptg_motivo_reprogramacion",
            value: request.idMotivo
          });
        }

        opportRecord.save();

        if (status == "14") {
          responseData.isSuccessful = true;
          responseData.message = "Opportunity Canceled.";
          responseData.apiErrorPost = null;
        }

        if (status == "11") {
          responseData.isSuccessful = true;
          responseData.message = "Opportunity Rescheduled.";
          responseData.apiErrorPost = null;
        }

        if (status == "13") {
          responseData.isSuccessful = true;
          responseData.message = "confirmed opportunity.";
          responseData.apiErrorPost = null;
        }

      } catch (err) {
        responseData.apiErrorPost.push(error.errorNotParameter(err.message));
      }
    }

    function getServiceStatus(salesRepId, status, resultArray, responseData) {

      try {
        // se resive el id representante de venta y se pasa a decimal
        var salesRepId = parseInt(salesRepId, 10);
        // si no existe el representante de venta muestra un error
        // para mmayor informacion de errores ver el modulo : ptg_module_errors.js
        if (!salesRepId) {
          responseData.apiErrorGet.push(error.errorOnlyDate());
        }

        log.debug({
          title: "salesRepId",
          details: salesRepId
        });

        try {
          // se carga la busqueda guardada
          let searchOport = search.create({
            type: "transaction",
            filters: [
              ["type", "anyof", "Opprtnty"], "AND",
              ["salesrep", "anyof", salesRepId], "AND",
              ["trandate", "within", "today"], "AND",
              ["shipping", "is", "F"], "AND",
              ["taxline", "is", "F"], "AND",
              ["cogs", "is", "F"], "AND",
              ["entitystatus", "anyof", status]

            ],
            columns: [
              "trandate",
              "closedate",
              "expectedclosedate",
              "bidclosedate",
              "entity",
              "entitystatus",
              "title",
              "salesrep",
              "custbody_ptg_hora_cierre",
              "custbody_hour",
              "shipaddress",
              "custbody_route",
              "custbody_ptg_turn",
              "custbody_ptg_opcion_pago",
              "custbody_ptg_numero_viaje",
              "billaddress",
              "item",
              search.createColumn({
                name: "salesdescription",
                join: "item"
              }),
              "quantity",
              "unit",
              "rate",
              "total",
              "amount",
              "line",
              "taxamount",
              "taxcode"
            ]
          });

          /**
           * , "AND", 
              ["status","anyof","Opprtnty:C"]
           */

          // filtrar por representante de venta
          /*  let salesRepFilter = search.createFilter({ name: "salesrep", operator: search.Operator.ANYOF, values: salesRepId });
           searchOport.filters.push(salesRepFilter); */

          //Filtro por fecha actual
          log.audit({
            title: "searchOport",
            details: searchOport
          })

          // se corre la busqueda guarda , almacennado la informacion actualizada en una variable
          var resultSet = searchOport.run();

        } catch (error) {
          log.debug({
            title: "ERR-001: configuración invalida",
            details: error.message
          });
          responseData.apiErrorGet.push(error.errorSearch());
        }

        // se realiza el mapeo de la busqueda por id
        var count = 0;
        resultSet.each((results) => {
          count = count + 1

          let internalId = results.id;
          //let closeDateReal = results.getValue({ name: "closedate" });
          // se carga el registro de oportunidad por el id de la oportunidad
          //var opportRecord = record.load({ type: record.Type.OPPORTUNITY, id: internalId, isDynamic: true });
          // se obtiene cada valor de registro de la oportunidad

          if (results.getValue({
            name: "line"
          }) == "0") {
            let status = results.getValue({
              name: "entitystatus"
            });
            let dateCreateFormat = results.getValue({
              name: "trandate"
            });
            let closeDateFormat = results.getValue({
              name: "expectedclosedate"
            });
            let customer = results.getValue({
              name: "entity"
            });
            let customerName = results.getText({
              name: "entity"
            });
            let operario = results.getValue({
              name: "salesrep"
            });
            let hourFormat = results.getValue({
              name: "custbody_hour"
            });
            let address = results.getValue({
              name: "billaddress"
            });
            let route = results.getValue({
              name: "custbody_route"
            });
            let turn = results.getValue({
              name: "custbody_ptg_turn"
            });
            let paymentMethod = results.getValue({
              name: "custbody_ptg_opcion_pago"
            });
            let numViaje = results.getValue({
              name: "custbody_ptg_numero_viaje"
            });

            var closeDate = formatDate(closeDateFormat);
            var dateCreate = formatDate(dateCreateFormat);
            var hour = formatTime(hourFormat);

            resultArray.push({
              id: results.id,
              status,
              dateCreateFormat,
              closeDateFormat,
              customer,
              customerName,
              operario,
              hourFormat,
              address,
              route,
              turn,
              paymentMethod,
              numViaje,
              items: []
            })

          } else if (results.id == resultArray[resultArray.length - 1].id) {
            var article = results.getValue({
              name: "item"
            });
            var articleText = (results.getValue({
              name: "salesdescription",
              join: "item"
            })).trim();
            var quantity = results.getValue({
              name: "quantity"
            });
            var units = results.getValue({
              name: "unit"
            });
            var price = results.getValue({
              name: "rate"
            });
            var amount = results.getValue({
              name: "amount"
            });
            var importTotal = results.getValue({
              name: "total"
            });
            var line = results.getValue({
              name: "line"
            });
            var taxImport = results.getValue({
              name: "taxamount"
            });
            var tax = results.getText({
              name: "taxcode"
            });

            resultArray[resultArray.length - 1].items.push({
              article,
              articleText,
              quantity,
              units,
              price,
              amount,
              importTotal,
              tax,
              taxImport
            })
          }

          return true;
        });
        log.debug({
          title: "count",
          details: count
        })

        responseData.data = resultArray; // pisamos la data de nuestra estructura de datos
        return true;
      } catch (err) {
        responseData.apiErrorGet.push(error.errorNotParameter(err.message)); // error multifuncional caprutado por el catch
      }

    }

    return {
      getTodayService: getTodayService,
      createItem: createItem,
      createOrder: createOrder,
      modifOpportunity: modifOpportunity,
      changeStatusOpportunity: changeStatusOpportunity,
      getServiceStatus: getServiceStatus,
      formatDate: formatDate,
      horaMilitar: horaMilitar
    };
  });