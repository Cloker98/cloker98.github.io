<?php 
// Formulário de Contato
$msg = '';
if (isset($_POST['submit'])) {
	
	$name = $_POST['name'];
	$lastName = $_POST['lastname'];
	$phone = $_POST['phone'];
	$subject = $_POST['subject'];
	$mailFrom = $_POST['mail'];
	$message = $_POST['message'];

	$mailTo = "elizeugsn@gmail.com";
	//$headers = "From: ".$mailFrom;
	//$txt = "You have received an e-mail from ".$name." ".$lastname.".\n\n".$message;

	//mail($mailTo, $subject, $txt, $headers);
	//header("Location: index.php?mailsend");

	//
	require_once 'vendor/autoload.php';
	require_once 'info.php'

	// Create the Transport
	$transport = (new Swift_SmtpTransport('smtp.gmail.com', 587, 'tls'))
	  ->setUsername(EMAIL)
	  ->setPassword(PASS)
	;

	// Create the Mailer using your created Transport
	$mailer = new Swift_Mailer($transport);

	// Create a message
	$txt = (new Swift_Message($subject))
	  ->setFrom([$mailFrom => $name + $lastname])
	  ->setTo([$mailTo])
	  ->setBody("You have received an e-mail from ".$name." ".$lastname.".\nEmail: ".$mailFrom."\nPhone: ".$phone."\nMessage:".$message)
	  ;

	// Send the message
	$result = $mailer->send($txt);

	if(!$result){
		$msg = '<div class="alert alert-danger text-center">Something Went Wrong!</div>';

	}
	else{
		$msg = '<div class="alert alert-success text-center">Message Sent Successfully!</div>';

	}

	}
?>