

CREATE PROCEDURE [dbo].[dd_billing_classification_sel]
( 
	@user_id INT = NULL
)
AS
BEGIN
	SELECT * FROM dbo.billing_classifications;
 END;
