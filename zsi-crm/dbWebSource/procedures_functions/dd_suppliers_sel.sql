


CREATE PROCEDURE [dbo].[dd_suppliers_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	SELECT supplier_id, supplier_name FROM dbo.suppliers WHERE is_active='Y';
 END;



