
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: March 2, 2017 12:09 AM
-- Description:	Procurement late delivery report.
-- =============================================
CREATE PROCEDURE [dbo].[procurement_late_delivery_report_sel]
(
    @date_from		NVARCHAR(15),
	@date_to		NVARCHAR(15),
	@supplier_id	INT,
	@search			NVARCHAR(20)
)
AS
BEGIN

SET NOCOUNT ON

	DECLARE @stmt NVARCHAR(1000) = '';

	SET @stmt = 'SELECT procurement_date, procurement_code, procurement_name, ' +
				'dbo.getSupplySourceName(supplier_id) AS supplier_name, ' +
				'promised_delivery_date, actual_delivery_date, ' +
		        'dbo.getStatus(status_id) AS status_name, ' +
		        'dbo.sumProcurementAmount(procurement_id) AS total_amount ' +
	            'FROM dbo.procurement ' +
				'WHERE 1=1 ' +
				'AND actual_delivery_date > promised_delivery_date '

	IF @date_from IS NOT NULL AND @date_to IS NOT NULL
		SET @stmt = @stmt + 'AND procurement_date >= ''' + @date_from + ''' AND procurement_date <= ''' + @date_to + ''' '

	IF @supplier_id IS NOT NULL
		SET @stmt = @stmt + 'AND supplier_id = ' + CAST(@supplier_id AS VARCHAR(50)) + ' '
	
	IF @search IS NOT NULL			
		SET @stmt = @stmt + 'AND procurement_code LIKE ''%' + @search + '%'''
	
	EXEC(@stmt);
END

