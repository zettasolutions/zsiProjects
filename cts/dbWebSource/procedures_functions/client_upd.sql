

CREATE PROCEDURE [dbo].[client_upd]
(
    @tt    clients_tt READONLY
   ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
-- Update Process
    UPDATE a 
        SET  client_name	=	upper(b.client_name)
			,address		=	upper(b.address)
			,contact_number	=	upper(b.contact_number)
			,is_active	    =	upper(b.is_active)
			,updated_by		=	@user_id
            ,updated_date   =	GETDATE()
		FROM dbo.clients a INNER JOIN @tt b
        ON a.client_id = b.client_id 
		WHERE isnull(b.is_edited,'N')='Y'

END





