/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 07/2022
 * Script name: PTG - Registro para crear clientes UE
 * Script id: customscript_drt_ptg_registro_cliente_ue
 * customer Deployment id: customdeploy_drt_ptg_registro_cliente_ue
 * Applied to: PTG - Registro para crear clientes
 * File: drt_ptg_registro_clientes_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/task", "N/format", "N/config", "N/runtime"], function (record, search, task, format, config, runtime) {
  function afterSubmit(context) {
    try {
      if (context.type == "create") {
      var newRecord = context.newRecord;
      var recId = newRecord.id;
      var recType = newRecord.type;
      var customerObj = {};
      var formulario = 0;
      var clienteIndividual = 0;
      var tipoCliente = newRecord.getValue("custrecord_ptg_tipocliente_");
      var nombreCliente = newRecord.getValue("custrecord_ptg_nombrecliente_");
      var apellidoCliente = newRecord.getValue("custrecord_ptg_apellido_");
      var empresa = newRecord.getValue("custrecord_ptg_empresa_");
      var rfc = newRecord.getValue("custrecord_ptg_rfc_");
      var usoCFDI = newRecord.getValue("custrecord_ptg_usocfdi_registro_");
      var metodoDePago = newRecord.getValue("custrecord_ptg_formadepago_");
      var formaDePago = newRecord.getValue("custrecord_ptg_metododepago_registro");
      var planta = newRecord.getValue("custrecord_ptg_registro_cliente_planta");
      var correoElectronico = newRecord.getValue("custrecord_ptg_registro_cliente_email");

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        formulario = 194;
        clienteIndividual = 1;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        formulario = 180;
        clienteIndividual = 1;
      }

      var locationObj = record.load({
        type: search.Type.LOCATION,
        id: planta
      });

      var subsidiaria = locationObj.getValue("subsidiary");

      log.audit("Create");

      var recCliente = record.create({
        type: record.Type.CUSTOMER,
        isDynamic: true,
      });

      recCliente.setValue("customform", formulario);
      recCliente.setValue("subsidiary", subsidiaria);
      if(tipoCliente == clienteIndividual){
        recCliente.setValue("isperson", "T");
        recCliente.setValue("firstname", nombreCliente);
        recCliente.setValue("lastname", apellidoCliente);
      } else {
        recCliente.setValue("isperson", "F");
      }      
      recCliente.setValue("companyname", empresa);
      recCliente.setValue("custentity_mx_rfc", rfc);
      recCliente.setValue("email", correoElectronico);
      recCliente.setValue("custentity_disa_uso_de_cfdi_", usoCFDI);
      recCliente.setValue("custentity_disa_metodo_de_pago_", metodoDePago);
      recCliente.setValue("custentity_disa_forma_de_pago_", formaDePago);
      recCliente.setValue("custentity_razon_social_para_facturar", empresa);

      var recClienteSaved = recCliente.save();

      log.debug("Registro de cliente creado ", recClienteSaved);

      customerObj.custrecord_ptg_registro_cliente_creado = recClienteSaved;

      var registroUpd = record.submitFields({
        id: recId,
        type: recType,
        values: customerObj,
        options: {
          enableSourcing: false,
          ignoreMandatoryFields: true,
        },
      });

      log.debug("Registro actualizado ", registroUpd);
    } else {
      var newRecord = context.newRecord;
      var recId = newRecord.id;
      var recType = newRecord.type;
      var customerObj = {};
      var registroCliente = newRecord.getValue("custrecord_ptg_registro_cliente_creado");
      var tipoCliente = newRecord.getValue("custrecord_ptg_tipocliente_");
      var nombreCliente = newRecord.getValue("custrecord_ptg_nombrecliente_");
      var apellidoCliente = newRecord.getValue("custrecord_ptg_apellido_");
      var empresa = newRecord.getValue("custrecord_ptg_empresa_");
      var rfc = newRecord.getValue("custrecord_ptg_rfc_");
      var usoCFDI = newRecord.getValue("custrecord_ptg_usocfdi_registro_");
      var metodoDePago = newRecord.getValue("custrecord_ptg_formadepago_");
      var formaDePago = newRecord.getValue("custrecord_ptg_metododepago_registro");
      var correoElectronico = newRecord.getValue("custrecord_ptg_registro_cliente_email");
      log.audit("Edit");

      var recCliente = record.load({
        type: record.Type.CUSTOMER,
        id: registroCliente,
        isDynamic: true,
      });

      if(tipoCliente == clienteIndividual){
        recCliente.setValue("isperson", "T");
        recCliente.setValue("firstname", nombreCliente);
        recCliente.setValue("lastname", apellidoCliente);
      } else {
        recCliente.setValue("isperson", "F");
      }      
      recCliente.setValue("companyname", empresa);
      recCliente.setValue("custentity_mx_rfc", rfc);
      recCliente.setValue("email", correoElectronico);
      recCliente.setValue("custentity_disa_uso_de_cfdi_", usoCFDI);
      recCliente.setValue("custentity_disa_metodo_de_pago_", metodoDePago);
      recCliente.setValue("custentity_disa_forma_de_pago_", formaDePago);

      var recClienteSaved = recCliente.save();
      log.debug("Registro de cliente modificado ", recClienteSaved);

    }

    } catch (error) {
      log.error("Error afterSubmit", error);
    }
  }

  return {
    afterSubmit: afterSubmit,
  };
});
