

CREATE PROCEDURE [dbo].[dd_clients_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	SELECT client_id, client_name FROM dbo.clients WHERE is_zfare='Y';
 END;


